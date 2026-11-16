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
        Admin.Configure(builder);
        var app = builder.Build();
        Admin.Map(app, arguments.Database);
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
        ["workbook-preview"] = "", ["workbook-import"] = "",
        ["pricing"] = "sales finance", ["cost-set"] = "finance", ["inventory-options"] = "sales warehouse finance", ["tiers"] = "sales finance", ["tier-set"] = "finance", ["tier-remove"] = "finance",
        ["reorder-report"] = "warehouse",
        ["staff"] = "", ["import"] = "", ["audit"] = "", ["compatibility"] = "",
        ["product"] = "warehouse", ["receive"] = "warehouse", ["quote"] = "sales", ["kit"] = "sales", ["reserve"] = "sales", ["cancel"] = "sales",
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
        if (args.Command is "reserve" or "cancel" or "pay" or "inventory")
            Transaction(() => { ExpireReservations(); return true; });
        return Transaction(() =>
        {
            var result = RunCommand(args, role, staffPassword);
            if (args.Command is not ("inventory" or "audit" or "order" or "orders" or "workbook-preview" or "pricing" or "inventory-options" or "tiers" or "reorder-report"))
                Execute("INSERT INTO audit(actor,action,details) VALUES ($0,$1,$2)", args.Actor, args.Command,
                    JsonSerializer.Serialize(new { arguments = args.Rest(0), order_id =
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
        order["total_cents"] = lines.Sum(item => Number(item, "quantity") * Number(item, "unit_cents"));
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

    private object RunCommand(Arguments args, string actorRole, string? staffPassword)
    {
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
                    brands = Query("SELECT DISTINCT brand FROM products WHERE brand<>'' ORDER BY brand COLLATE NOCASE")
                        .Select(row => row["brand"]),
                    categories = Query("SELECT DISTINCT category FROM products WHERE category<>'' ORDER BY category COLLATE NOCASE")
                        .Select(row => row["category"])
                };
            case "inventory":
                var search = args.Option("--search");
                var brand = args.Option("--brand");
                var category = args.Option("--category");
                return Query("""
                    SELECT sku,name,brand,category,active,on_hand,reserved,available,kind,channels
                    FROM inventory WHERE ($0 IS NULL OR sku=$0)
                      AND ($1 IS NULL OR name LIKE $1 OR sku LIKE $1)
                      AND ($2 IS NULL OR brand=$2 COLLATE NOCASE)
                      AND ($3 IS NULL OR category=$3 COLLATE NOCASE)
                    ORDER BY sku
                    """, args.Rest(0).FirstOrDefault(), search == null ? null : "%" + search + "%", brand, category);
            case "audit":
                return Query("SELECT * FROM audit ORDER BY id DESC LIMIT 100");
        }
        return new { ok = true };
    }
}
