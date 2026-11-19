using System.Text.Json.Nodes;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Data.Sqlite;
using Microsoft.VisualBasic.FileIO;

try
{
    var arguments = new Arguments(args);
    if (arguments.Command is "--help" or "help")
    {
        Console.WriteLine("Usage: Retail [--db FILE] [--actor USER] COMMAND [arguments]\n" +
            "init, staff, import, product, receive, compatibility, quote, kit, " +
            "reserve, cancel, pay, dispatch, return, order, inventory, audit, serve, " +
            "workbook-preview, workbook-import, pricing, cost-set, tiers, tier-set, tier-remove, inventory-options, reorder-report");
        return 0;
    }

    if (arguments.Command == "serve")
    {
        var port = arguments.Option("--port") ?? "8787";
        var builder = WebApplication.CreateBuilder(Array.Empty<string>());
        Admin.Configure(builder, arguments.Database);
        var app = builder.Build();
        Admin.Map(app, arguments.Database);
        app.MapGet("/api/retail/products", async (HttpContext context) =>
        {
            using var store = new RetailStore(arguments.Database);
            var auth=await Microsoft.AspNetCore.Authentication.AuthenticationHttpContextExtensions.AuthenticateAsync(context,"Customer");
            var tier=auth.Succeeded?(string)store.CustomerProfile(long.Parse(auth.Principal!.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value))["price_tier"]!:"S · Trade Price";
            context.Response.Headers.CacheControl="no-store";
            context.Response.Headers.Vary="Cookie";
            return Results.Ok(store.Transaction(() =>
            {
                store.ExpireReservations();
                return store.StorefrontProducts(tier);
            }));
        });
        app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
        app.MapGet("/products", (string? sku, string? q) =>
        {
            using var store = new RetailStore(arguments.Database);
            var results = store.Transaction(() =>
            {
                store.ExpireReservations();
                return store.Query("""
                    SELECT inventory.sku,name,brand,category,trade.cents AS retail_cents,NULL AS sale_cents,available > 0 AS in_stock, url AS source_url
                    FROM inventory LEFT JOIN product_price_tiers trade ON trade.sku=inventory.sku AND trade.tier='S · Trade Price' AND trade.cents>0 LEFT JOIN product_source_links ON product_source_links.sku=inventory.sku WHERE active=1 AND ($0 IS NULL OR inventory.sku=$0)
                      AND (name LIKE $1 OR inventory.sku LIKE $1) ORDER BY inventory.sku LIMIT 100
                    """, sku, "%" + q + "%");
            });
            return sku != null && results.Count == 0 ? Results.NotFound(results) : Results.Ok(results);
        });
        var storefrontDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../dist/client"));
        if (Directory.Exists(storefrontDirectory))
        {
            var storefrontFiles = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(storefrontDirectory);
            app.UseStaticFiles(new StaticFileOptions { FileProvider = storefrontFiles });
            app.MapFallback(async context =>
            {
                if (context.Request.Path.StartsWithSegments("/api") || context.Request.Path.StartsWithSegments("/admin"))
                {
                    context.Response.StatusCode = 404;
                    return;
                }
                context.Response.ContentType = "text/html";
                await context.Response.SendFileAsync(Path.Combine(storefrontDirectory, "index.html"));
            });
        }
        app.Run(Environment.GetEnvironmentVariable("ASPNETCORE_URLS") ?? $"http://127.0.0.1:{port}");
        return 0;
    }

    using var retail = new RetailStore(arguments.Database);
    Console.WriteLine(JsonSerializer.Serialize(retail.Run(arguments), new JsonSerializerOptions { WriteIndented = true }));
    return 0;
}
catch (Exception error) when (error is ArgumentException or SqliteException or IOException or FormatException or OverflowException or System.Xml.XmlException or InvalidDataException)
{
    Console.Error.WriteLine(error.Message);
    return 1;
}

sealed class Arguments
{
    private readonly List<string> values;
    public string Command { get; }
    public string Database { get; }
    public string Actor { get; }

    public Arguments(string[] args)
    {
        values = args.ToList();
        var database = Option("--db");
        Database = database == null ? Path.Combine(ProjectRoot, "outputs/retail.sqlite") : ResolvePath(database);
        Actor = Option("--actor") ?? "owner";
        Command = values.Count == 0 ? "help" : values[0];
        if (values.Count > 0) values.RemoveAt(0);
    }

    public Arguments(string command, string actor, string database, IEnumerable<string> parameters)
    {
        Command = command;
        Actor = actor;
        Database = database;
        values = parameters.ToList();
    }

    private static string ProjectRoot => Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../.."));

    public static string ResolvePath(string path)
    {
        // dotnet run --project backend launches the app from the backend directory.
        var workingDirectory = Directory.GetCurrentDirectory();
        if (workingDirectory == Path.Combine(ProjectRoot, "backend"))
            workingDirectory = ProjectRoot;
        return Path.GetFullPath(path, workingDirectory);
    }

    public string At(int index) => index < values.Count && !values[index].StartsWith("--")
        ? values[index] : throw new ArgumentException($"Missing argument {index + 1} for {Command}.");

    public string? Option(string name) => Options(name).SingleOrDefault();

    public List<string> Options(string name)
    {
        var result = new List<string>();
        for (int index; (index = values.IndexOf(name)) >= 0;)
        {
            result.Add(At(index + 1));
            values.RemoveRange(index, 2);
        }
        return result;
    }

    public bool Flag(string name) => values.Remove(name);
    public IEnumerable<string> Rest(int start) => values.Skip(start);
}

sealed partial class RetailStore : IDisposable
{
    private readonly SqliteConnection database;
    private SqliteTransaction? transaction;
    private static readonly Dictionary<string, string> Roles = new()
    {
        ["fulfilments"] = "sales warehouse finance", ["customers"] = "sales", ["return-requests"] = "sales warehouse finance",
        ["commerce-data"] = "sales warehouse finance", ["commerce-order"] = "sales warehouse finance",
        ["customer-invite"] = "sales", ["order-shipping"] = "sales finance", ["customer-save"] = "sales", ["order-create"] = "sales", ["order-payment"] = "finance",
        ["fulfilment-save"] = "warehouse", ["return-request"] = "sales finance",
        ["return-process"] = "warehouse finance", ["refund-record"] = "finance",
        ["workbook-preview"] = "", ["workbook-import"] = "",
        ["pricing"] = "sales finance", ["cost-set"] = "finance", ["inventory-options"] = "sales warehouse finance", ["inventory-suggest"] = "sales warehouse finance", ["tiers"] = "sales finance", ["tier-set"] = "finance", ["tier-remove"] = "finance",
        ["stock-details"] = "warehouse", ["stock-set"] = "warehouse", ["reorder-report"] = "warehouse",
        ["staff"] = "", ["import"] = "", ["audit"] = "", ["compatibility"] = "",
        ["product-details"] = "warehouse", ["product-content"] = "warehouse", ["product"] = "warehouse", ["receive"] = "warehouse", ["quote"] = "sales", ["kit"] = "sales", ["reserve"] = "sales", ["cancel"] = "sales",
        ["pay"] = "finance", ["dispatch"] = "warehouse", ["return"] = "finance",
        ["orders"] = "sales warehouse finance", ["order"] = "sales warehouse finance", ["inventory"] = "sales warehouse finance"
    };

    public RetailStore(string path)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(path))!);
        database = new SqliteConnection(new SqliteConnectionStringBuilder
        {
            DataSource = path, ForeignKeys = true, DefaultTimeout = 10
        }.ToString());
        database.Open();
        Execute(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "schema.sql")));
        RemoveLegacyStatusMarkers();
        ImportStorefrontContent();
    }

    public void Dispose() => database.Dispose();

    public T Transaction<T>(Func<T> action)
    {
        using var current = database.BeginTransaction(deferred: false);
        transaction = current;
        try
        {
            var result = action();
            current.Commit();
            return result;
        }
        finally { transaction = null; }
    }

    private SqliteCommand Command(string sql, object?[] parameters)
    {
        var command = database.CreateCommand();
        command.Transaction = transaction;
        command.CommandText = sql;
        for (var index = 0; index < parameters.Length; index++)
            command.Parameters.AddWithValue($"${index}", parameters[index] ?? DBNull.Value);
        return command;
    }

    private int Execute(string sql, params object?[] parameters)
    {
        using var command = Command(sql, parameters);
        return command.ExecuteNonQuery();
    }

    public List<Dictionary<string, object?>> Query(string sql, params object?[] parameters)
    {
        using var command = Command(sql, parameters);
        using var reader = command.ExecuteReader();
        var result = new List<Dictionary<string, object?>>();
        while (reader.Read())
        {
            var row = new Dictionary<string, object?>();
            for (var index = 0; index < reader.FieldCount; index++)
                row[reader.GetName(index)] = reader.IsDBNull(index) ? null : reader.GetValue(index);
            result.Add(row);
        }
        return result;
    }

    private Dictionary<string, object?> Row(string sql, params object?[] parameters) =>
        Query(sql, parameters).FirstOrDefault() ?? throw new ArgumentException("Record not found.");

    private static long Number(Dictionary<string, object?> row, string key) => Convert.ToInt64(row[key]);
    private static long Positive(string value)
    {
        var number = int.Parse(value, CultureInfo.InvariantCulture);
        Check(number > 0, "Expected a positive whole number.");
        return number;
    }

    private static void Check(bool condition, string message)
    {
        if (!condition) throw new ArgumentException(message);
    }

    private static string Password(string prompt)
    {
        Console.Error.Write(prompt);
        if (Console.IsInputRedirected) return Console.ReadLine() ?? "";
        var password = new StringBuilder();
        while (true)
        {
            var key = Console.ReadKey(intercept: true);
            if (key.Key == ConsoleKey.Enter) break;
            if (key.Key == ConsoleKey.Backspace && password.Length > 0) password.Length--;
            if (!char.IsControl(key.KeyChar)) password.Append(key.KeyChar);
        }
        Console.Error.WriteLine();
        return password.ToString();
    }

    private static byte[] Hash(string password, string salt) =>
        Rfc2898DeriveBytes.Pbkdf2(password, Convert.FromHexString(salt), 600_000, HashAlgorithmName.SHA256, 32);

    private void AddStaff(string user, string role, string? suppliedPassword = null)
    {
        var password = suppliedPassword ?? Password("New password: ");
        Check(password.Length >= 12, "Use at least 12 characters.");
        if (suppliedPassword == null) Check(password == Password("Repeat password: "), "Passwords differ.");
        var salt = Convert.ToHexString(RandomNumberGenerator.GetBytes(16));
        Execute("INSERT INTO staff VALUES ($0,$1,$2,$3)", user, role, salt, Convert.ToHexString(Hash(password, salt)));
    }

    public object Run(Arguments args)
    {
        if (args.Command == "init")
            return Transaction(() =>
            {
                Check(Query("SELECT 1 FROM staff LIMIT 1").Count == 0, "Staff already initialized.");
                AddStaff(args.At(0), "owner");
                return new { ok = true };
            });

        var role = Authenticate(args.Actor, Password("Password: "));
        Check(role != null, "Invalid staff credentials.");
        return RunAuthorized(args, role!);
    }

    public string? Authenticate(string actor, string password)
    {
        var staff = Query("SELECT * FROM staff WHERE username=$0", actor).FirstOrDefault();
        var hash = Hash(password, staff == null ? new string('0', 32) : (string)staff["salt"]!);
        return staff != null && CryptographicOperations.FixedTimeEquals(
            Convert.FromHexString((string)staff["password_hash"]!), hash) ? (string)staff["role"]! : null;
    }

    public static string[] Commands(string role) =>
        Roles.Keys.Where(command => role == "owner" || Roles[command].Split(' ').Contains(role)).ToArray();

    public object RunAuthorized(Arguments args, string role, string? staffPassword = null)
    {
        Check(Commands(role).Contains(args.Command), "Permission denied.");
        if (args.Command is "reserve" or "cancel" or "pay" or "inventory" or "stock-details" or "stock-set" or "commerce-data" or "commerce-order" or "order-create" or "order-payment" or "fulfilment-save")
            Transaction(() => { ExpireReservations(); return true; });
        return Transaction(() =>
        {
            var result = RunCommand(args, role, staffPassword);
            if (args.Command is not ("fulfilments" or "customers" or "return-requests" or "commerce-data" or "commerce-order" or "inventory" or "audit" or "order" or "orders" or "workbook-preview" or "product-details" or "stock-details" or "pricing" or "inventory-options" or "inventory-suggest" or "tiers" or "reorder-report"))
                Execute("INSERT INTO audit(actor,action,details) VALUES ($0,$1,$2)", args.Actor, args.Command,
                    JsonSerializer.Serialize(new { arguments = args.Command == "product-content" ? args.Rest(0).Take(1) : args.Rest(0), order_id =
                        args.Command is "quote" or "kit" ? ((Dictionary<string, object?>)result)["id"] : null }));
            return result;
        });
    }

    private void Move(string sku, long onHand, long reserved, string reason, string actor)
    {
        var stock = Row("SELECT * FROM inventory WHERE sku=$0", sku);
        var nextReserved = Number(stock, "reserved") + reserved;
        Check(nextReserved >= 0 && nextReserved <= Number(stock, "on_hand") + onHand,
            $"Insufficient stock for {sku}.");
        Execute("INSERT INTO stock_movements(sku,on_hand_delta,reserved_delta,reason,actor) VALUES ($0,$1,$2,$3,$4)",
            sku, onHand, reserved, reason, actor);
    }

    private object SetStock(Arguments args)
    {
        var sku = args.At(0);
        var mode = args.At(1);
        var target = int.Parse(args.At(2), CultureInfo.InvariantCulture);
        var expectedAvailable = long.Parse(args.At(3), CultureInfo.InvariantCulture);
        var expectedReserved = long.Parse(args.At(4), CultureInfo.InvariantCulture);
        var reason = $"{mode} stock updated";
        Check(mode is "available" or "reserved", "Choose available or reserved stock.");
        Check(target >= 0, "Enter a non-negative quantity.");
        var current = Row("SELECT available,reserved FROM inventory WHERE sku=$0", sku);
        var available = Number(current, "available");
        var reserved = Number(current, "reserved");
        Check(available == expectedAvailable && reserved == expectedReserved,
            "Stock changed while this page was open. Reopen the stock editor to load current quantities.");
        if (mode == "available")
            Move(sku, target - available, 0, reason, args.Actor);
        else
        {
            var linked = Row("""
                SELECT COALESCE(SUM(quantity),0) AS quantity FROM order_lines
                JOIN orders ON orders.id=order_lines.order_id
                WHERE sku=$0 AND status IN ('reserved','paid')
                """, sku);
            Check(target >= Number(linked, "quantity"),
                $"Orders currently reserve {Number(linked, "quantity")} units. Release the relevant orders before lowering reserved stock below that quantity.");
            Move(sku, 0, target - reserved, reason, args.Actor);
        }
        return Row("SELECT sku,name,available,reserved FROM inventory WHERE sku=$0", sku);
    }

    private object Import(string path, string actor)
    {
        using var csv = new TextFieldParser(path) { Delimiters = new[] { "," }, TrimWhiteSpace = false };
        var header = csv.ReadFields() ?? throw new ArgumentException("Empty inventory.");
        var seen = new HashSet<string>(StringComparer.Ordinal);
        var inserted = 0;
        while (csv.ReadFields() is { } fields)
        {
            Check(fields.Length == header.Length, "Invalid CSV row.");
            string Field(string name)
            {
                var index = Array.IndexOf(header, name);
                return index >= 0 ? fields[index] : throw new ArgumentException($"Missing column: {name}.");
            }
            var sku = CleanProductSku(Field("SKU"));
            Check(sku.Length > 0 && seen.Add(sku), $"Blank or duplicate SKU: {sku}.");
            var stock = int.Parse(Field("Stock"), CultureInfo.InvariantCulture);
            var active = Field("Active");
            Check(stock >= 0 && active is "Yes" or "No", $"Invalid opening stock or active value: {sku}.");
            if (Execute("""
                INSERT INTO products(sku,name,brand,category,active)
                VALUES ($0,$1,$2,$3,$4) ON CONFLICT(sku) DO NOTHING
                """, sku, CleanProductName(Field("Product")), Field("Brand"), Field("Category"), active == "Yes") == 1)
            {
                Move(sku, stock, 0, "opening stock", actor);
                inserted++;
            }
        }
        return new { inserted, existing = seen.Count - inserted };
    }

    private List<Dictionary<string, object?>> Lines(long order) =>
        Query("SELECT * FROM order_lines WHERE order_id=$0 ORDER BY sku", order);

    private object Order(long id)
    {
        var order = Row("SELECT * FROM orders WHERE id=$0", id);
        var lines = Lines(id);
        order["lines"] = lines;
        var productsTotal=lines.Sum(item => Number(item, "quantity") * Number(item, "unit_cents"));
        var charges=Query("SELECT * FROM order_charges WHERE order_id=$0",id).FirstOrDefault();
        order["subtotal_cents"]=productsTotal;
        order["shipping_pending"]=charges!=null && charges["shipping_cents"]==null;
        order["shipping_cents"]=charges?["shipping_cents"];
        order["installation_cents"]=charges==null?0:Number(charges,"installation_cents");
        order["installation_details"]=charges?["installation_details"];
        order["total_cents"]=productsTotal+(charges==null?0:Convert.ToInt64(charges["shipping_cents"]??0)+Number(charges,"installation_cents"));
        order["returns"] = Query("SELECT * FROM returns WHERE order_id=$0 ORDER BY id", id);
        return order;
    }

    public void ExpireReservations()
    {
        foreach (var order in Query("SELECT id,created_by FROM orders WHERE status='reserved' AND julianday(expires_at)<=julianday('now')"))
        {
            var id = Number(order, "id");
            foreach (var item in Lines(id))
                Move((string)item["sku"]!, 0, -Number(item, "quantity"), $"order {id} expired", (string)order["created_by"]!);
            Execute("UPDATE orders SET status='cancelled' WHERE id=$0", id);
        }
    }

    private static Dictionary<string, string> Pairs(IEnumerable<string> entries)
    {
        var values = new Dictionary<string, string>();
        foreach (var entry in entries)
        {
            var separator = entry.LastIndexOf('=');
            Check(separator > 0 && values.TryAdd(entry[..separator], entry[(separator + 1)..]), "Use unique SKU=value entries.");
        }
        return values;
    }

    private object Quote(Arguments args)
    {
        var tier = args.Option("--tier");
        var days = Positive(args.Option("--days") ?? "7");
        var quantities = Pairs(args.Rest(args.Command == "kit" ? 1 : 0))
            .ToDictionary(pair => pair.Key, pair => Positive(pair.Value));
        Check(quantities.Count > 0, "Supply at least one component.");
        if (args.Command == "kit")
        {
            var recorder = args.At(0);
            var product = Row("SELECT channels FROM products WHERE sku=$0 AND kind='recorder'", recorder);
            Check(!quantities.ContainsKey(recorder), "Specify the recorder separately.");
            long cameras = 0;
            foreach (var (sku, quantity) in quantities)
            {
                var component = Row("""
                    SELECT kind FROM products JOIN compatibility ON sku=component
                    WHERE recorder=$0 AND component=$1 AND kind IN ('camera','storage')
                    """, recorder, sku);
                if ((string)component["kind"]! == "camera") cameras += quantity;
            }
            Check(cameras > 0 && cameras <= Number(product, "channels"), "Camera quantity exceeds channel capacity or is zero.");
            quantities.Add(recorder, 1);
        }

        var id = Number(Row("""
            INSERT INTO orders(expires_at,created_by) VALUES ($0,$1) RETURNING id
            """, DateTimeOffset.UtcNow.AddDays(days).ToString("O"), args.Actor), "id");
        foreach (var (sku, quantity) in quantities)
        {
            var prices = Query("""
                SELECT t.cents FROM products p JOIN product_price_tiers t ON p.sku=t.sku
                WHERE p.sku=$0 AND p.active=1 AND t.tier=$1 AND t.cents>0
                """, sku, tier ?? "S · Trade Price");
            Check(prices.Count > 0, $"No verified price in {tier ?? "S · Trade Price"} for active SKU {sku}.");
            Execute("INSERT INTO order_lines VALUES ($0,$1,$2,$3)", id, sku, quantity, prices[0]["cents"]);
        }
        return Order(id);
    }

    private object Transition(Arguments args)
    {
        var id = Positive(args.At(0));
        var order = Row("SELECT * FROM orders WHERE id=$0", id);
        var status = (string)order["status"]!;
        var (expected, next) = args.Command switch
        {
            "reserve" => ("quoted", "reserved"),
            "cancel" => ("reserved", "cancelled"),
            "pay" => ("reserved", "paid"),
            _ => ("paid", "dispatched")
        };
        if (args.Command == "pay" && Equals(order["payment_ref"], args.At(1).Trim())) return Order(id);
        Check(status == expected, $"Order is {status}; expected {expected}.");
        if (args.Command is "reserve" or "pay")
            Check(DateTimeOffset.Parse((string)order["expires_at"]!, CultureInfo.InvariantCulture) > DateTimeOffset.UtcNow,
                "Quote or reservation expired.");
        if (args.Command is "reserve" or "cancel")
        {
            foreach (var item in Lines(id))
            {
                var sku = (string)item["sku"]!;
                if (args.Command == "reserve") Row("SELECT sku FROM products WHERE sku=$0 AND active=1", sku);
                var delta = Number(item, "quantity") * (args.Command == "reserve" ? 1 : -1);
                Move(sku, 0, delta, $"order {id} {next}", args.Actor);
            }
        }
        if (args.Command == "pay")
        {
            Check(Query("SELECT 1 FROM order_charges WHERE order_id=$0 AND shipping_cents IS NULL",id).Count==0,"Confirm shipping charges before recording payment.");
            var reference = args.At(1).Trim();
            Check(reference.Length > 0, "Enter a payment reference.");
            Execute("UPDATE orders SET payment_ref=$0 WHERE id=$1", reference, id);
        }
        if (args.Command == "dispatch") Dispatch(id, args);
        Execute("UPDATE orders SET status=$0 WHERE id=$1", next, id);
        return Order(id);
    }

    private void Dispatch(long id, Arguments args)
    {
        var serials = Pairs(args.Options("--serial"));
        foreach (var item in Lines(id))
        {
            var sku = (string)item["sku"]!;
            var quantity = Number(item, "quantity");
            var product = Row("SELECT kind FROM products WHERE sku=$0", sku);
            var values = serials.Remove(sku, out var supplied) ? supplied.Split(',').Select(s => s.Trim()).ToArray() : [];
            if ((string)product["kind"]! is "camera" or "recorder" || values.Length > 0)
                Check(values.Length == quantity && values.All(value => value.Length > 0), $"Provide {quantity} serials for {sku}.");
            foreach (var value in values)
                Execute("INSERT INTO dispatched_units VALUES ($0,$1,$2)", value, id, sku);
            Move(sku, -quantity, -quantity, $"order {id} dispatched", args.Actor);
        }
        Check(serials.Count == 0, "Serials supplied for a SKU outside this order.");
    }

    private object ReceiveReturn(Arguments args)
    {
        var serial = args.Option("--serial");
        var sellable = args.Flag("--sellable");
        var id = Positive(args.At(0));
        var sku = args.At(1);
        var quantity = Positive(args.At(2));
        var order = Row("SELECT status FROM orders WHERE id=$0", id);
        Check((string)order["status"]! == "dispatched", "Only dispatched items can be returned.");
        var item = Row("SELECT * FROM order_lines WHERE order_id=$0 AND sku=$1", id, sku);
        if (Query("SELECT 1 FROM dispatched_units WHERE order_id=$0 AND sku=$1", id, sku).Count > 0)
        {
            Check(serial != null && quantity == 1, "Return serialized items one serial at a time.");
            Row("SELECT 1 FROM dispatched_units WHERE serial=$0 AND order_id=$1 AND sku=$2", serial, id, sku);
        }
        else Check(serial == null, "No serial was recorded for this order line.");
        var returned = Row("SELECT COALESCE(SUM(quantity),0) AS total FROM returns WHERE order_id=$0 AND sku=$1", id, sku);
        Check(Number(returned, "total") + quantity <= Number(item, "quantity"), "Return exceeds dispatched quantity.");
        Execute("""
            INSERT INTO returns(order_id,sku,quantity,serial,sellable,refund_cents,reason)
            VALUES ($0,$1,$2,$3,$4,$5,$6)
            """, id, sku, quantity, serial, sellable, quantity * Number(item, "unit_cents"), args.At(3));
        if (sellable) Move(sku, quantity, 0, $"order {id} inspected return", args.Actor);
        return Order(id);
    }

    private static string CommerceText(JsonObject data, string key, int max = 1000) =>
        (data[key]?.GetValue<string>() ?? "").Trim() is var value && value.Length <= max
            ? value : throw new ArgumentException($"{key} is too long.");

    private object CommerceOrder(long id)
    {
        var order = (Dictionary<string, object?>)Order(id);
        order["customer"] = Query("SELECT * FROM order_customers WHERE order_id=$0", id).FirstOrDefault();
        order["payment"] = Query("SELECT * FROM order_payments WHERE order_id=$0", id).FirstOrDefault();
        order["fulfilment"] = Query("SELECT * FROM fulfilments WHERE order_id=$0", id).FirstOrDefault();
        return order;
    }

    private object Commerce(Arguments args, string role)
    {
        if (args.Command is "commerce-data" or "fulfilments" or "customers" or "return-requests") return new
        {
            customers = Query("SELECT * FROM customers ORDER BY name COLLATE NOCASE"),
            orders = Query("""
                SELECT o.*,c.customer_name,c.customer_email,
                    (SELECT SUM(quantity*unit_cents) FROM order_lines WHERE order_id=o.id)+COALESCE(ch.shipping_cents,0)+COALESCE(ch.installation_cents,0) AS total_cents,
                    CASE WHEN ch.order_id IS NOT NULL AND ch.shipping_cents IS NULL THEN 1 ELSE 0 END AS shipping_pending,
                    f.method,f.status AS fulfilment_status,f.carrier,f.tracking,f.collection_contact,
                    COALESCE((SELECT SUM(amount_cents) FROM refund_records rr JOIN return_requests r ON r.id=rr.request_id WHERE r.order_id=o.id),0) AS refunded_cents
                FROM orders o LEFT JOIN order_customers c ON c.order_id=o.id
                LEFT JOIN fulfilments f ON f.order_id=o.id LEFT JOIN order_charges ch ON ch.order_id=o.id ORDER BY o.id DESC
                """),
            returns = Query("""
                SELECT r.*,p.name AS product_name,COALESCE(t.refund_cents,0) AS refund_due_cents,
                    x.amount_cents AS refunded_cents,x.reference AS refund_reference
                FROM return_requests r JOIN products p ON p.sku=r.sku
                LEFT JOIN returns t ON t.id=r.return_id LEFT JOIN refund_records x ON x.request_id=r.id
                ORDER BY r.id DESC
                """),
            legacyReturns = Query("SELECT r.* FROM returns r WHERE NOT EXISTS(SELECT 1 FROM return_requests q WHERE q.return_id=r.id) ORDER BY r.id DESC"),
            tiers = WorkbookTierNames()
        };
        if (args.Command == "commerce-order") return CommerceOrder(Positive(args.At(0)));
        var data = JsonNode.Parse(args.At(0)) as JsonObject ?? throw new ArgumentException("Invalid form.");
        long Id(string key) => Positive(CommerceText(data,key));
        Arguments CommandArgs(string command, params string[] values) => new(command,args.Actor,args.Database,values);
        if(args.Command=="customer-invite")
        {
            var id=Id("customer_id");CustomerProfile(id);
            Check(Query("SELECT 1 FROM customer_credentials WHERE customer_id=$0",id).Count==0,"This customer already has a storefront login.");
            var token=Convert.ToHexString(RandomNumberGenerator.GetBytes(24));
            Execute("INSERT INTO customer_invitations VALUES ($0,$1,$2) ON CONFLICT(customer_id) DO UPDATE SET token_hash=excluded.token_hash,expires_at=excluded.expires_at",id,
                Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token))),DateTimeOffset.UtcNow.AddDays(2).ToString("O"));
            return new{invitation=token};
        }
        if(args.Command=="order-shipping")
        {
            var id=Id("order_id");Check(Equals(Row("SELECT status FROM orders WHERE id=$0",id)["status"],"reserved"),"Shipping charges can only be confirmed before payment.");
            var cents=long.Parse(CommerceText(data,"shipping_cents"),CultureInfo.InvariantCulture);Check(cents>=0&&cents<=10000000,"Enter a valid shipping amount.");
            Check(Execute("UPDATE order_charges SET shipping_cents=$0 WHERE order_id=$1 AND shipping_cents IS NULL",cents,id)==1,"Shipping has already been confirmed. Refresh the order.");
            return CommerceOrder(id);
        }
        if (args.Command == "customer-save")
        {
            var id = CommerceText(data,"id");
            var name = CommerceText(data,"name",200);
            var email = CommerceText(data,"email",254).ToLowerInvariant();
            Check(name.Length > 0 && System.Net.Mail.MailAddress.TryCreate(email,out var mail) && mail.Address == email,
                "Enter a customer name and valid email address.");
            var tier = CommerceText(data,"price_tier");
            Check(WorkbookTierNames().Contains(tier), "Choose a company price tier.");
            var values = new object?[] {name,email,CommerceText(data,"company",200),CommerceText(data,"phone",100),CommerceText(data,"address",2000),
                data["active"]!.GetValue<bool>(),data["can_purchase"]!.GetValue<bool>(),tier};
            if (id.Length == 0)
                Execute("INSERT INTO customers(name,email,company,phone,address,active,can_purchase,price_tier) VALUES ($0,$1,$2,$3,$4,$5,$6,$7)", values);
            else
            {
                var changed = Execute("""
                    UPDATE customers SET name=$0,email=$1,company=$2,phone=$3,address=$4,active=$5,can_purchase=$6,price_tier=$7,version=version+1
                    WHERE id=$8 AND version=$9
                    """, values.Concat(new object?[]{Positive(id),Id("version")}).ToArray());
                Check(changed == 1,"Customer changed. Reopen the customer to load current information.");
            }
            return new { saved = true };
        }
        if (args.Command == "order-create")
        {
            var customer = Row("SELECT * FROM customers WHERE id=$0 AND active=1 AND can_purchase=1",Id("customer_id"));
            var lines = data["items"]!.AsArray().OfType<JsonObject>().ToArray();
            Check(lines.Length > 0 && lines.Length <= 100,"Add between 1 and 100 products.");
            var values = lines.Select(line => CommerceText(line,"sku")+"="+Positive(CommerceText(line,"quantity"))).ToList();
            values.AddRange(["--tier",(string)customer["price_tier"]!]);
            var quoted = (Dictionary<string,object?>)Quote(new Arguments("quote",args.Actor,args.Database,values));
            var id = Number(quoted,"id");
            Execute("INSERT INTO order_customers VALUES ($0,$1,$2,$3,$4)",id,customer["id"],customer["name"],customer["email"],customer["price_tier"]);
            var method = data["method"] == null ? "delivery" : CommerceText(data,"method");
            Check(method == "delivery","Only shipping is supported.");
            Execute("INSERT INTO fulfilments(order_id,method,address,collection_contact) VALUES ($0,$1,$2,$3)",id,method,customer["address"],customer["name"]);
            Transition(CommandArgs("reserve",id.ToString()));
            return CommerceOrder(id);
        }
        if (args.Command == "order-payment")
        {
            var id = Id("order_id");
            var reference = CommerceText(data,"reference",200);
            var method = CommerceText(data,"method",100);
            Check(reference.Length>0 && method is "bank transfer" or "card" or "other","Enter a payment reference and method.");
            var order = (Dictionary<string,object?>)Order(id);
            var amount = Id("amount_cents");
            Check(!(bool)order["shipping_pending"]!,"Confirm shipping charges before recording payment.");
            Check(amount == Number(order,"total_cents"),"Payment must match the full order total.");
            var existing = Query("SELECT * FROM order_payments WHERE order_id=$0",id).FirstOrDefault();
            if (existing != null)
            {
                Check(Equals(existing["reference"],reference) && Number(existing,"amount_cents")==amount && Equals(existing["method"],method),"Payment is already recorded.");
                return CommerceOrder(id);
            }
            Transition(CommandArgs("pay",id.ToString(),reference));
            Execute("INSERT INTO order_payments(order_id,amount_cents,reference,method,actor) VALUES ($0,$1,$2,$3,$4)",id,amount,reference,method,args.Actor);
            return CommerceOrder(id);
        }
        if (args.Command == "fulfilment-save")
        {
            var id = Id("order_id");
            var order = Row("SELECT status FROM orders WHERE id=$0",id);
            Check((string)order["status"]! is "reserved" or "paid","Only open orders can be prepared or fulfilled.");
            var current = Query("SELECT * FROM fulfilments WHERE order_id=$0",id).FirstOrDefault();
            var expected = long.Parse(CommerceText(data,"version"),CultureInfo.InvariantCulture);
            Check((current==null ? 0 : Number(current,"version"))==expected,"Shipping changed. Reopen the order.");
            var method = data["method"] == null ? "delivery" : CommerceText(data,"method");
            var status = CommerceText(data,"status");
            Check(method == "delivery" && status is "queued" or "preparing" or "ready" or "dispatched","Choose a valid shipping status. Pickup is not supported.");
            Check(status != "dispatched" || method == "delivery","Dispatch applies to delivery orders.");
            var address=CommerceText(data,"address",2000); var carrier=CommerceText(data,"carrier",200);
            var tracking=CommerceText(data,"tracking",200); var contact=CommerceText(data,"collection_contact",200);
            if (status is "ready" or "dispatched")
            {
                Check(Equals(order["status"],"paid"),"Record payment before marking an order ready or completed.");
                Check(address.Length>0,"Enter the delivery address.");
            }
            if (status=="dispatched") Check(carrier.Length>0 && tracking.Length>0,"Enter a carrier and tracking number.");
            if (status == "dispatched")
            {
                var serials = CommerceText(data,"serials",5000).Split('\n',StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                var values = new List<string>{id.ToString()};
                foreach (var serial in serials) values.AddRange(["--serial",serial]);
                Dispatch(id,new Arguments("dispatch",args.Actor,args.Database,values));
                Execute("UPDATE orders SET status='dispatched' WHERE id=$0",id);
            }
            Execute("""
                INSERT INTO fulfilments(order_id,method,status,address,carrier,tracking,collection_contact,notes)
                VALUES ($0,$1,$2,$3,$4,$5,$6,$7)
                ON CONFLICT(order_id) DO UPDATE SET method=excluded.method,status=excluded.status,address=excluded.address,
                    carrier=excluded.carrier,tracking=excluded.tracking,collection_contact=excluded.collection_contact,
                    notes=excluded.notes,version=fulfilments.version+1,updated_at=CURRENT_TIMESTAMP
                """,id,method,status,address,carrier,tracking,contact,CommerceText(data,"notes",2000));
            return CommerceOrder(id);
        }
        if (args.Command == "return-request")
        {
            var id=Id("order_id");var sku=CommerceText(data,"sku");var quantity=Id("quantity");
            Check(Equals(Row("SELECT status FROM orders WHERE id=$0",id)["status"],"dispatched"),"Only fulfilled orders can be returned.");
            var item=Row("SELECT quantity FROM order_lines WHERE order_id=$0 AND sku=$1",id,sku);
            var pending=Number(Row("SELECT COALESCE(SUM(quantity),0) AS n FROM return_requests WHERE order_id=$0 AND sku=$1 AND status IN ('requested','approved')",id,sku),"n");
            var received=Number(Row("SELECT COALESCE(SUM(quantity),0) AS n FROM returns WHERE order_id=$0 AND sku=$1",id,sku),"n");
            Check(pending+received+quantity<=Number(item,"quantity"),"Return requests exceed the fulfilled quantity.");
            var reason=CommerceText(data,"reason",2000);Check(reason.Length>0,"Enter the return reason.");
            var serial=CommerceText(data,"serial",200);
            if (Query("SELECT 1 FROM dispatched_units WHERE order_id=$0 AND sku=$1",id,sku).Count>0)
            {
                Check(quantity==1 && serial.Length>0,"Request serialised returns one unit at a time.");
                Row("SELECT serial FROM dispatched_units WHERE order_id=$0 AND sku=$1 AND serial=$2",id,sku,serial);
                Check(Query("SELECT 1 FROM return_requests WHERE serial=$0 AND status!='rejected'",serial).Count==0,"A return already exists for this serial.");
            }
            else Check(serial.Length==0,"No serial was recorded for this order line.");
            Execute("INSERT INTO return_requests(order_id,sku,quantity,reason,serial) VALUES ($0,$1,$2,$3,$4)",id,sku,quantity,reason,serial.Length==0?null:serial);
            return new { saved=true };
        }
        if (args.Command == "return-process")
        {
            var id=Id("request_id");var decision=CommerceText(data,"decision");
            var request=Row("SELECT * FROM return_requests WHERE id=$0",id);var status=(string)request["status"]!;
            Check(status=="requested" && decision is "approved" or "rejected" || status=="approved" && decision=="received","This return cannot make that transition.");
            if (decision=="received")
            {
                var values=new List<string>{request["order_id"]!.ToString()!,(string)request["sku"]!,request["quantity"]!.ToString()!,(string)request["reason"]!};
                if (request["serial"] is string serial) values.AddRange(["--serial",serial]);
                if (data["sellable"]?.GetValue<bool>()==true) values.Add("--sellable");
                ReceiveReturn(new Arguments("return",args.Actor,args.Database,values));
                var returned=Row("SELECT id FROM returns WHERE order_id=$0 AND sku=$1 ORDER BY id DESC LIMIT 1",request["order_id"],request["sku"]);
                Execute("UPDATE return_requests SET return_id=$0 WHERE id=$1",returned["id"],id);
            }
            Execute("UPDATE return_requests SET status=$0 WHERE id=$1",decision,id);
            return new { saved=true };
        }
        if (args.Command == "refund-record")
        {
            var id=Id("request_id");var reference=CommerceText(data,"reference",200);Check(reference.Length>0,"Enter the refund transaction reference.");
            var request=Row("SELECT t.refund_cents FROM return_requests r JOIN returns t ON t.id=r.return_id WHERE r.id=$0 AND r.status='received'",id);
            var amount=Id("amount_cents");Check(amount==Number(request,"refund_cents"),"Refund must match the received return value.");
            var existing=Query("SELECT * FROM refund_records WHERE request_id=$0",id).FirstOrDefault();
            if(existing!=null) {Check(Equals(existing["reference"],reference) && Number(existing,"amount_cents")==amount,"A refund is already recorded.");return new{saved=true};}
            Execute("INSERT INTO refund_records(request_id,amount_cents,reference,actor) VALUES ($0,$1,$2,$3)",id,amount,reference,args.Actor);
            return new{saved=true};
        }
        throw new ArgumentException("Unknown commerce operation.");
    }

    private static string[] WorkbookTierNames() => ["S · Trade Price","S · (E) with QTY","S · (S) with BIG QTY","S · 1.53","S · 1.5","S · 1.45","S · 1.38 Wholesaler Tier 1","P · (E) with QTY","P · (S) with BIG QTY","P · 1.53","P · 1.5","P · 1.45","P · 1.38 Wholesaler Tier 1"];

    private object RunCommand(Arguments args, string actorRole, string? staffPassword)
    {
        if (args.Command is "fulfilments" or "customers" or "return-requests" or "commerce-data" or "commerce-order" or "customer-invite" or "order-shipping" or "customer-save" or "order-create" or "order-payment" or "fulfilment-save" or "return-request" or "return-process" or "refund-record")
            return Commerce(args, actorRole);
        switch (args.Command)
        {
            case "workbook-preview":
            case "workbook-import":
                return ImportWorkbook(Arguments.ResolvePath(args.At(0)), args.Actor, args.Command == "workbook-preview");
            case "pricing":
                var pricingSku = args.At(0);
                return new
                {
                    product = Row("SELECT sku,name FROM products WHERE sku=$0", pricingSku),
                    cost_cents = actorRole is "owner" or "finance"
                        ? Row("SELECT cost_cents FROM products WHERE sku=$0", pricingSku)["cost_cents"] : null,
                    tiers = Query("SELECT tier,cents FROM product_price_tiers WHERE sku=$0", pricingSku)
                };
            case "cost-set":
                long? supplierCost = args.At(1) == "clear" ? null : Positive(args.At(1));
                Check(Execute("UPDATE products SET cost_cents=$0 WHERE sku=$1", supplierCost, args.At(0)) == 1,
                    "Product SKU not found.");
                break;
            case "tiers":
                return Query("SELECT tier,cents FROM product_price_tiers WHERE sku=$0 ORDER BY tier", args.At(0));
            case "tier-set":
                SetTier(args.At(0), args.At(1), Positive(args.At(2)));
                break;
            case "tier-remove":
                Execute("DELETE FROM product_price_tiers WHERE sku=$0 AND tier=$1", args.At(0), args.At(1));
                break;
            case "reorder-report":
                return Query("""
                    SELECT sku,name,brand,on_hand,reserved,available FROM inventory
                    WHERE active=1 AND available <= $0 AND ($1 IS NULL OR brand=$1 COLLATE NOCASE)
                    ORDER BY available,sku
                    """, Positive(args.At(0)), args.Rest(1).FirstOrDefault());
            case "staff":
                var role = args.At(1);
                Check(role is "sales" or "warehouse" or "finance" or "owner", "Unknown role.");
                AddStaff(args.At(0), role, staffPassword);
                break;
            case "import":
                return Import(Arguments.ResolvePath(args.At(0)), args.Actor);
            case "product-details":
                return ProductContent(args.At(0));
            case "product-content":
                return SaveProductContent(args.At(0), args.At(1));
            case "product":
                var kind = args.Option("--kind") ?? "other";
                var channels = args.Option("--channels");
                var archived = args.Flag("--archived");
                Execute("""
                    INSERT INTO products(sku,name,brand,category,active,kind,channels)
                    VALUES ($0,$1,$2,$3,$4,$5,$6)
                    ON CONFLICT(sku) DO UPDATE SET name=excluded.name,brand=excluded.brand,category=excluded.category,
                        active=excluded.active,kind=excluded.kind,channels=excluded.channels
                    """, CleanProductSku(args.At(0)), CleanProductName(args.At(1)), args.At(2), args.At(3), !archived, kind,
                    channels == null ? null : Positive(channels));
                break;
            case "stock-details":
                return Row("""
                    SELECT sku,name,available,reserved,
                        (SELECT COALESCE(SUM(quantity),0) FROM order_lines
                         JOIN orders ON orders.id=order_lines.order_id
                         WHERE order_lines.sku=inventory.sku AND status IN ('reserved','paid')) AS order_reserved
                    FROM inventory WHERE sku=$0
                    """, args.At(0));
            case "stock-set":
                return SetStock(args);
            case "receive":
                Move(args.At(0), int.Parse(args.At(1), CultureInfo.InvariantCulture), 0, args.At(2), args.Actor);
                break;
            case "compatibility":
                Row("SELECT 1 FROM products WHERE sku=$0 AND kind='recorder'", args.At(0));
                Row("SELECT 1 FROM products WHERE sku=$0 AND kind IN ('camera','storage')", args.At(1));
                Execute("INSERT OR IGNORE INTO compatibility VALUES ($0,$1)", args.At(0), args.At(1));
                break;
            case "quote":
            case "kit":
                return Quote(args);
            case "reserve":
            case "cancel":
            case "pay":
            case "dispatch":
                return Transition(args);
            case "return":
                return ReceiveReturn(args);
            case "orders":
                return Query("SELECT id,status,expires_at,created_by FROM orders ORDER BY id DESC LIMIT 250");
            case "order":
                return Order(Positive(args.At(0)));
            case "inventory-options":
                return new
                {
                    catalogueCategories = CatalogueCategories(),
                    brands = Query("SELECT DISTINCT brand FROM products WHERE brand<>'' ORDER BY brand COLLATE NOCASE")
                        .Select(row => row["brand"]),
                    categories = Query("SELECT DISTINCT category FROM products WHERE category<>'' ORDER BY category COLLATE NOCASE")
                        .Select(row => row["category"])
                };
            case "inventory-suggest":
                var phrase = args.At(0).Trim();
                var suggestionBrand = args.Option("--brand");
                var suggestionCategory = args.Option("--category");
                Check(phrase.Length is > 0 and <= 200, "Enter up to 200 search characters.");
                return Query("""
                    SELECT sku,name,brand,active FROM products
                    WHERE (instr(lower(name),lower($0))>0 OR instr(lower(sku),lower($0))>0)
                      AND ($1 IS NULL OR brand=$1 COLLATE NOCASE)
                      AND ($2 IS NULL OR category=$2 COLLATE NOCASE)
                    ORDER BY CASE WHEN lower(sku)=lower($0) THEN 0
                        WHEN instr(lower(sku),lower($0))=1 THEN 1
                        WHEN instr(lower(name),lower($0))=1 THEN 2 ELSE 3 END,
                        name COLLATE NOCASE,sku
                    LIMIT 8
                    """, phrase, suggestionBrand, suggestionCategory);
            case "inventory":
                var search = args.Option("--search");
                var brand = args.Option("--brand");
                var category = args.Option("--category");
                return Query("""
                    SELECT inventory.sku,name,brand,category,active,on_hand,reserved,available,kind,channels,
                           json_extract(payload,'$.image') AS image
                    FROM inventory LEFT JOIN storefront_content ON storefront_content.sku=inventory.sku WHERE ($0 IS NULL OR inventory.sku=$0)
                      AND ($1 IS NULL OR name LIKE $1 OR inventory.sku LIKE $1)
                      AND ($2 IS NULL OR brand=$2 COLLATE NOCASE)
                      AND ($3 IS NULL OR category=$3 COLLATE NOCASE)
                    ORDER BY inventory.sku
                    """, args.Rest(0).FirstOrDefault(), search == null ? null : "%" + search + "%", brand, category);
            case "audit":
                return Query("SELECT * FROM audit ORDER BY id DESC LIMIT 100");
        }
        return new { ok = true };
    }
}
