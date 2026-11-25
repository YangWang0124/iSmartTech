using System.Globalization;
using Microsoft.AspNetCore.DataProtection;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

sealed partial class RetailStore
{
    private static string CatalogueId(string sku) =>
        "inventory-" + Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(sku)))[..20].ToLowerInvariant();

    private void ImportStorefrontContent()
    {
        const string migration = "storefront-content-v1";
        if (Query("SELECT 1 FROM retail_migrations WHERE name=$0", migration).Count > 0) return;
        var path = Path.Combine(AppContext.BaseDirectory, "catalogue-seed.json");
        Check(File.Exists(path), "Missing catalogue-seed.json. Rebuild the backend.");
        var seed = JsonNode.Parse(File.ReadAllText(path))!["products"]!.AsArray();
        Transaction(() =>
        {
            if (Query("SELECT 1 FROM retail_migrations WHERE name=$0", migration).Count > 0) return true;
            foreach (var item in seed)
            {
                var product = item!.AsObject();
                var sku = CleanProductSku(product["sku"]!.GetValue<string>());
                var existing = Query("SELECT sku FROM products WHERE sku=$0 COLLATE NOCASE", sku).FirstOrDefault();
                if (existing != null) sku = (string)existing["sku"]!;
                var name = CleanProductName(product["name"]!.GetValue<string>());
                var brand = product["brand"]!.GetValue<string>();
                var category = product["category"]!.GetValue<string>();
                // This migration preserves stock and publication state for inventory already imported.
                Execute("""
                    INSERT INTO products(sku,name,brand,category,active) VALUES ($0,$1,$2,$3,1)
                    ON CONFLICT(sku) DO UPDATE SET name=excluded.name,brand=excluded.brand,category=excluded.category
                    """, sku, name, brand, category);
                var id = product["id"]!.GetValue<string>();
                product["sku"] = sku;
                foreach (var alias in product["routeAliases"]!.AsArray())
                    Execute("INSERT INTO storefront_aliases VALUES ($0,$1)", alias!.GetValue<string>(), sku);
                product.Remove("routeAliases");
                product.Remove("sku");
                product.Remove("name");
                product.Remove("brand");
                product.Remove("category");
                product.Remove("id");
                Execute("INSERT INTO storefront_content(sku,route_id,payload) VALUES ($0,$1,$2)", sku, id, product.ToJsonString());
            }
            Execute("INSERT OR IGNORE INTO storefront_aliases SELECT 'dahua-nvr4104',sku FROM storefront_content WHERE route_id='curated-dahua-nvr4104'");
            Execute("INSERT INTO retail_migrations VALUES ($0)", migration);
            return true;
        });
    }

    private static List<object> CatalogueCategories()
    {
        var seed = JsonNode.Parse(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "catalogue-seed.json")))!;
        var categories = new List<object>();
        void Walk(JsonArray nodes, int[] parents, string[] labels)
        {
            foreach (var node in nodes.OfType<JsonObject>())
            {
                var id = node["id"]!.GetValue<int>();
                var title = node["title"]!.GetValue<string>();
                var path = parents.Append(id).ToArray();
                var names = labels.Append(title).ToArray();
                categories.Add(new { title, ids = path, label = string.Join(" / ", names) });
                Walk(node["sub_cat"]!.AsArray(), path, names);
            }
        }
        Walk(seed["categories"]!.AsArray(), [], []);
        return categories;
    }

    private static Dictionary<string, string> ProductThumbnails()
    {
        var thumbnailPath = Path.Combine(AppContext.BaseDirectory, "../../../wwwroot/admin/thumbnails.json");
        // In published builds, content assets live beside the application.
        if (!File.Exists(thumbnailPath)) thumbnailPath = Path.Combine(AppContext.BaseDirectory, "wwwroot/admin/thumbnails.json");
        return File.Exists(thumbnailPath)
            ? JsonSerializer.Deserialize<Dictionary<string, string>>(File.ReadAllText(thumbnailPath))! : [];
    }

    private JsonObject ProductContent(string sku)
    {
        var core = Row("SELECT * FROM inventory WHERE sku=$0", sku);
        var stored = Query("SELECT route_id,payload FROM storefront_content WHERE sku=$0", sku).FirstOrDefault();
        var payload = stored == null ? new JsonObject() : JsonNode.Parse((string)stored["payload"]!)!.AsObject();
        payload["id"] = stored?["route_id"] as string ?? CatalogueId(sku);
        payload["sku"] = sku;
        foreach (var key in new[] { "name", "brand", "category", "kind" }) payload[key] = (string)core[key]!;
        payload["channels"] = core["channels"] == null ? null : JsonValue.Create(Number(core, "channels"));
        payload["active"] = Number(core, "active") == 1;
        if (payload["image"] == null && ProductThumbnails().TryGetValue(sku, out var image))
            payload["image"] = "/admin/thumbnails/" + image;
        return payload;
    }

    public object StorefrontProducts(string priceTier = "S · Trade Price")
    {
        var result = new List<JsonObject>();
        var source = Query("""
            SELECT i.*, c.route_id,c.payload,t.cents
            FROM inventory i LEFT JOIN storefront_content c ON c.sku=i.sku
            LEFT JOIN product_price_tiers t ON t.sku=i.sku AND t.tier=$0 AND t.cents>0
            WHERE i.active=1 ORDER BY i.sku
            """, priceTier);
        var aliases = Query("SELECT route_id,sku FROM storefront_aliases")
            .GroupBy(item => (string)item["sku"]!).ToDictionary(group => group.Key,
                group => group.Select(item => (string)item["route_id"]!).ToArray());
        var thumbnails = ProductThumbnails();
        foreach (var row in source)
        {
            var sku = (string)row["sku"]!;
            var product = row["payload"] is string json ? JsonNode.Parse(json)!.AsObject() : new JsonObject();
            product["id"] = row["route_id"] as string ?? CatalogueId(sku);
            product["sku"] = sku;
            foreach (var key in new[] { "name", "brand", "category" }) product[key] = (string)row[key]!;
            product["price"] = row["cents"] == null ? 0 : Number(row, "cents") / 100m;
            product["priceOnRequest"] = row["cents"] == null;
            product["stock"] = Number(row, "available");
            if (product["subProducts"] is JsonArray variants)
            {
                foreach (var variant in variants.OfType<JsonObject>())
                {
                    variant.Remove("price");
                    variant.Remove("stock");
                    var variantSku = variant["sku"]?.GetValue<string>();
                    if (variantSku == null) continue;
                    var variantRows = Query("""
                        SELECT i.available,t.cents FROM inventory i
                        LEFT JOIN product_price_tiers t ON t.sku=i.sku AND t.tier=$0 AND t.cents>0
                        WHERE i.sku=$1 AND i.active=1
                        """, priceTier, variantSku);
                    if (variantRows.Count > 0)
                    {
                        variant["stock"] = Number(variantRows[0], "available");
                        if (variantRows[0]["cents"] != null) variant["price"] = Number(variantRows[0], "cents") / 100m;
                    }
                }
            }
            product["managedByBackend"] = true;
            product["routeAliases"] = JsonSerializer.SerializeToNode(aliases.GetValueOrDefault(sku, []));
            product["published"] = true;
            product["shortDescription"] ??= "";
            product["description"] ??= "";
            product["features"] ??= new JsonArray();
            product["specifications"] ??= new JsonObject();
            product["rating"] ??= 0;
            product["reviews"] ??= 0;
            product["icon"] ??= "TECH";
            product["accent"] ??= "blue";
            if (product["image"] == null && thumbnails.TryGetValue(sku, out var image))
                product["image"] = "/admin/thumbnails/" + image;
            result.Add(product);
        }
        return result;
    }

    public string SaveProductImage(byte[] content, string actor)
    {
        Check(content.Length is > 12 and <= 8 * 1024 * 1024, "Choose an image under 8 MB.");
        string extension, contentType;
        if (content.AsSpan(0, 8).SequenceEqual(new byte[] {137,80,78,71,13,10,26,10}))
            (extension, contentType) = ("png", "image/png");
        else if (content[0] == 255 && content[1] == 216 && content[2] == 255 && content[^2] == 255 && content[^1] == 217)
            (extension, contentType) = ("jpg", "image/jpeg");
        else if (Encoding.ASCII.GetString(content, 0, 4) == "RIFF" && Encoding.ASCII.GetString(content, 8, 4) == "WEBP")
            (extension, contentType) = ("webp", "image/webp");
        else throw new ArgumentException("Choose a PNG, JPEG or WebP image.");
        var id = Convert.ToHexString(SHA256.HashData(content)).ToLowerInvariant() + "." + extension;
        Transaction(() =>
        {
            Execute("INSERT OR IGNORE INTO product_images(id,content_type,content) VALUES ($0,$1,$2)", id, contentType, content);
            Execute("INSERT INTO audit(actor,action,details) VALUES ($0,'image-upload',$1)", actor, id);
            return true;
        });
        return "/api/retail/images/" + id;
    }

    public Dictionary<string, object?> CustomerProfile(long id) => Row(
        """
        SELECT c.id,c.name,c.email,c.company,c.phone,c.address,c.active,c.can_purchase,c.price_tier,c.version,
          CASE WHEN s.verified_email=c.email COLLATE NOCASE THEN 1 ELSE 0 END AS email_verified
        FROM customers c LEFT JOIN customer_security s ON s.customer_id=c.id WHERE c.id=$0 AND c.active=1
        """,id);

    public object CustomerPublicProfile(long id)
    {
        var profile=CustomerProfile(id);profile.Remove("price_tier");return profile;
    }

    public long? AuthenticateCustomer(string email,string password)
    {
        var customer=Query("""
            SELECT c.id,a.salt,a.password_hash FROM customers c JOIN customer_credentials a ON a.customer_id=c.id
            WHERE c.email=$0 COLLATE NOCASE AND c.active=1
            """,email.Trim()).FirstOrDefault();
        var hash=Hash(password,customer==null?new string('0',32):(string)customer["salt"]!);
        return customer!=null && CryptographicOperations.FixedTimeEquals(Convert.FromHexString((string)customer["password_hash"]!),hash)
            ? Number(customer,"id") : null;
    }

    public long RegisterCustomer(JsonObject data)
    {
        var email=CommerceText(data,"email",254).ToLowerInvariant();var name=CommerceText(data,"name",200);if(name.Length==0)name=email;
        var password=data["password"]?.GetValue<string>()??"";
        Check(password.Length<=256,"Use a password between 12 and 256 characters.");
        Check(System.Net.Mail.MailAddress.TryCreate(email,out var address) && address.Address==email,"Enter a valid email address.");
        Check(password.Length>=12,"Use a password between 12 and 256 characters.");
        var customer=Query("SELECT * FROM customers WHERE email=$0 COLLATE NOCASE",email).FirstOrDefault();
        long id;
        if(customer!=null)
        {
            throw new ArgumentException("This email already has a customer record. Sign in, reset your password, or contact the store for help.");
        }
        else
        {
            Execute("INSERT INTO customers(name,email) VALUES ($0,$1)",name,email);
            id=Number(Row("SELECT id FROM customers WHERE email=$0",email),"id");
        }
        var salt=Convert.ToHexString(RandomNumberGenerator.GetBytes(16));
        Execute("INSERT INTO customer_credentials VALUES ($0,$1,$2)",id,salt,Convert.ToHexString(Hash(password,salt)));
        Execute("INSERT OR IGNORE INTO customer_security(customer_id) VALUES ($0)",id);
        Execute("DELETE FROM customer_invitations WHERE customer_id=$0",id);
        return id;
    }

    public object SubmitEnquiry(JsonObject data)
    {
        var kind=CommerceText(data,"kind",30);Check(kind is "" or "contact" or "installation","Unknown enquiry type.");
        var installation=kind=="installation";
        var first=installation?CommerceText(data,"name",200):CommerceText(data,"firstName",100);var last=installation?"":CommerceText(data,"lastName",100);
        var siteAddress=installation?CommerceText(data,"address",2000):"";
        var email=CommerceText(data,"email",254);var phone=CommerceText(data,"phone",100);
        var interest=installation?"Installation quote":CommerceText(data,"interest",100);var message=installation?CommerceText(data,"details",10000):CommerceText(data,"message",10000);
        var key=CommerceText(data,"requestKey",36);
        Check(first.Length>0 && (installation||last.Length>0),installation?"Enter your name.":"Enter your first and last name.");
        Check(!installation||(phone.Length>0&&siteAddress.Length>0),"Enter your contact number and full installation address.");
        Check(System.Net.Mail.MailAddress.TryCreate(email,out var address) && address.Address==email,"Enter a valid email address.");
        Check(message.Length>0,"Enter your enquiry message.");Check(Guid.TryParseExact(key,"D",out _),"Refresh the form and try again.");
        var prior=Query("SELECT * FROM enquiries WHERE request_key=$0",key).FirstOrDefault();
        if(prior!=null)
        {
            var priorAddress=Query("SELECT address FROM enquiry_installation WHERE enquiry_id=$0",prior["id"]).FirstOrDefault();
            Check((priorAddress!=null)==installation && (!installation||Equals(priorAddress!["address"],siteAddress)),"This submission reference was already used. Start a new enquiry.");
            Check(Equals(prior["first_name"],first)&&Equals(prior["last_name"],last)&&Equals(prior["email"],email)&&Equals(prior["phone"],phone)&&Equals(prior["interest"],interest)&&Equals(prior["message"],message),"This submission reference was already used. Start a new enquiry.");
            return new {reference=prior["reference"]};
        }
        var reference="ENQ-"+Convert.ToHexString(RandomNumberGenerator.GetBytes(8));
        Execute("INSERT INTO enquiries(reference,request_key,first_name,last_name,email,phone,interest,message) VALUES ($0,$1,$2,$3,$4,$5,$6,$7)",reference,key,first,last,email,phone,interest,message);
        if(installation)Execute("INSERT INTO enquiry_installation(enquiry_id,address) SELECT id,$0 FROM enquiries WHERE reference=$1",siteAddress,reference);
        return new {reference};
    }

    private object EnquiryList(string status)
    {
        Check(status is "all" or "new" or "in-progress" or "closed","Choose an enquiry status.");
        return Query("SELECT e.id,e.reference,e.first_name,e.last_name,e.email,e.interest,e.status,e.created_at,e.version,CASE WHEN i.enquiry_id IS NULL THEN 'contact' ELSE 'installation' END AS kind FROM enquiries e LEFT JOIN enquiry_installation i ON i.enquiry_id=e.id WHERE ($0='all' OR e.status=$0) ORDER BY e.id DESC LIMIT 500",status);
    }

    private object UpdateEnquiry(Arguments args)
    {
        var id=Positive(args.At(0));var status=args.At(1);var notes=args.At(2);var version=Positive(args.At(3));
        Check(status is "new" or "in-progress" or "closed","Choose New, In progress or Closed.");Check(notes.Length<=10000,"Notes must be under 10,000 characters.");
        var current=Row("SELECT version FROM enquiries WHERE id=$0",id);Check(Number(current,"version")==version,"This enquiry changed. Refresh before saving.");
        Execute("UPDATE enquiries SET status=$0,notes=$1,version=version+1,updated_at=CURRENT_TIMESTAMP WHERE id=$2",status,notes,id);
        return new {saved=true};
    }

    public long CustomerCredentialRevision(long id) => Number(Row(
        "SELECT COALESCE(s.credential_revision,1) AS revision FROM customer_credentials c LEFT JOIN customer_security s ON s.customer_id=c.customer_id WHERE c.customer_id=$0",id),"revision");

    private void QueueOrderNotification(long id,string kind)
    {
        var customer=Query("SELECT customer_name,customer_email FROM order_customers WHERE order_id=$0",id).FirstOrDefault();
        if(customer==null)return;
        var order=(Dictionary<string,object?>)Order(id);
        var shipping=Query("SELECT address,carrier,tracking FROM fulfilments WHERE order_id=$0",id).FirstOrDefault();
        var snapshot=JsonSerializer.Serialize(new {
            id,kind,name=customer["customer_name"],email=customer["customer_email"],
            expires_at=order["expires_at"],subtotal_cents=order["subtotal_cents"],installation_cents=order["installation_cents"],
            shipping_cents=order["shipping_cents"],shipping_pending=order["shipping_pending"],total_cents=order["total_cents"],
            payment_ref=order["payment_ref"],address=shipping?["address"],carrier=shipping?["carrier"],tracking=shipping?["tracking"],
            lines=Query("SELECT l.sku,p.name,l.quantity,l.unit_cents FROM order_lines l JOIN products p ON p.sku=l.sku WHERE l.order_id=$0 ORDER BY l.sku",id)
        });
        var key=Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(snapshot)));
        Execute("INSERT OR IGNORE INTO order_notification_events(event_key,order_id,kind,snapshot) VALUES ($0,$1,$2,$3)",key,id,kind,snapshot);
    }

    // Templates use the event snapshot, so later order edits cannot rewrite an earlier notification.
    public int PrepareOrderNotifications(IDataProtector protector,string? siteUrl)
    {
        string? accountLink=null;
        if(!string.IsNullOrWhiteSpace(siteUrl))
        {
            Check(Uri.TryCreate(siteUrl,UriKind.Absolute,out var uri) && uri.UserInfo.Length==0 && uri.AbsolutePath=="/" && uri.Query.Length==0 && uri.Fragment.Length==0 && (uri.Scheme=="https"||(uri.Scheme=="http"&&uri.IsLoopback)),"Configure a valid ISMARTTECH_SITE_URL origin.");
            accountLink=uri!.GetLeftPart(UriPartial.Authority)+"/account";
        }
        var pending=Query("SELECT event_key,snapshot FROM order_notification_events WHERE mail_id IS NULL ORDER BY rowid LIMIT 50");
        foreach(var entry in pending)
        {
            var data=JsonNode.Parse((string)entry["snapshot"]!)!.AsObject();
            string Value(string key)=>data[key]?.ToString()??"";
            long Cents(string key)=>data[key]?.GetValue<long>()??0;
            string Amount(long cents)=>"NZ$"+(cents/100m).ToString("0.00",CultureInfo.InvariantCulture);
            var id=Value("id");var kind=Value("kind");var pendingShipping=data["shipping_pending"]!.GetValue<bool>();
            var heading=kind switch {"received"=>"Order received","delivery"=>"Delivery charge confirmed","paid"=>"Payment received","shipped"=>"Your order has shipped","expired"=>"Order reservation expired",_=>"Order cancelled"};
            var body=new StringBuilder().AppendLine("Hi "+Value("name")+",").AppendLine().AppendLine(heading+" — order #"+id).AppendLine();
            body.AppendLine(kind switch {
                "received"=>"Thank you for your order. Your items are reserved. No online payment has been taken.",
                "delivery"=>"Your delivery charge is confirmed. The total below includes delivery.",
                "paid"=>"We have confirmed your payment. Your order is being prepared for shipping.",
                "shipped"=>"Your order has been dispatched. Keep the courier and tracking number below for reference.",
                "expired"=>"The unpaid reservation has expired and the reserved stock has been released. Please contact us or place a new order if you still need these items.",
                _=>"Your order has been cancelled and the reserved stock has been released. Please contact us if you have questions."
            }).AppendLine();
            foreach(var line in data["lines"]!.AsArray().OfType<JsonObject>())
                body.AppendLine(line["name"]+" ("+line["sku"]+") × "+line["quantity"]+" — "+Amount(line["quantity"]!.GetValue<long>()*line["unit_cents"]!.GetValue<long>()));
            body.AppendLine().AppendLine("Products: "+Amount(Cents("subtotal_cents")));
            if(Cents("installation_cents")>0)body.AppendLine("Installation: "+Amount(Cents("installation_cents")));
            body.AppendLine("Delivery: "+(pendingShipping?"To be confirmed":data["shipping_cents"]==null?"Included in recorded total":Cents("shipping_cents")==0?"Free":Amount(Cents("shipping_cents"))));
            body.AppendLine("Total"+(pendingShipping?" before delivery":"")+": "+Amount(Cents("total_cents"))).AppendLine("Amounts include GST.").AppendLine();
            if(kind is "received" or "delivery")
            {
                if(pendingShipping)body.AppendLine("Next step: wait for the delivery quote and final total before paying. We will send another update when delivery is confirmed.");
                else {
                    var bankName=Environment.GetEnvironmentVariable("ISMARTTECH_BANK_ACCOUNT_NAME");var bankNumber=Environment.GetEnvironmentVariable("ISMARTTECH_BANK_ACCOUNT_NUMBER");
                    if(!string.IsNullOrWhiteSpace(bankName)&&!string.IsNullOrWhiteSpace(bankNumber))
                        body.AppendLine("Pay by bank transfer:\nAccount name: "+bankName+"\nAccount number: "+bankNumber+"\nAmount: "+Amount(Cents("total_cents"))+"\nReference: ORDER-"+id+"\nWe will confirm receipt after the funds reach our bank account.");
                    else body.AppendLine("Next step: the store will provide payment instructions. Do not send payment until you have those instructions.");
                }
                body.AppendLine("Reservation expires: "+TimeZoneInfo.ConvertTime(DateTimeOffset.Parse(Value("expires_at"),CultureInfo.InvariantCulture),TimeZoneInfo.FindSystemTimeZoneById("Pacific/Auckland")).ToString("d MMM yyyy, h:mm tt zzz",CultureInfo.InvariantCulture)+" NZ time.");
            }
            if(kind=="paid")body.AppendLine("Payment reference: "+Value("payment_ref"));
            if(kind=="shipped")body.AppendLine("Courier: "+Value("carrier")+"\nTracking number: "+Value("tracking")+"\nDelivery address: "+Value("address"));
            body.AppendLine().AppendLine(accountLink==null?"View the latest status in My Account on the iSmartTech website.":"View your order in My Account: "+accountLink);
            body.AppendLine("Questions? Contact info@ismarttech.co.nz and quote order #"+id+".").AppendLine().AppendLine("iSmartTech");
            QueueCustomerEmail(Value("email"),"iSmartTech order #"+id+" — "+heading,body.ToString(),protector);
            Execute("UPDATE order_notification_events SET mail_id=last_insert_rowid() WHERE event_key=$0",entry["event_key"]);
        }
        return pending.Count;
    }

    private void QueueCustomerEmail(string recipient,string subject,string body,IDataProtector protector) =>
        Execute("INSERT INTO customer_email_outbox(recipient,subject,protected_body) VALUES ($0,$1,$2)",recipient,subject,protector.Protect(body));

    public void RequestCustomerLink(string purpose,string email,string origin,IDataProtector protector)
    {
        Check(purpose is "verify" or "reset","Invalid account action.");
        var customer=Query("""
            SELECT c.*,s.verified_email FROM customers c JOIN customer_credentials a ON a.customer_id=c.id
            LEFT JOIN customer_security s ON s.customer_id=c.id WHERE c.email=$0 COLLATE NOCASE AND c.active=1
            """,email.Trim()).FirstOrDefault();
        if(customer==null)return;
        var id=Number(customer,"id");var address=(string)customer["email"]!;
        if(purpose=="verify" && string.Equals(customer["verified_email"] as string,address,StringComparison.OrdinalIgnoreCase))return;
        if(Query("SELECT 1 FROM customer_action_tokens WHERE customer_id=$0 AND purpose=$1 AND used_at IS NULL AND julianday(created_at)>julianday('now','-1 minute')",id,purpose).Count>0)return;
        Execute("UPDATE customer_action_tokens SET used_at=CURRENT_TIMESTAMP WHERE customer_id=$0 AND purpose=$1 AND used_at IS NULL",id,purpose);
        var token=Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        var hash=Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
        Execute("INSERT INTO customer_action_tokens(token_hash,customer_id,purpose,email,expires_at) VALUES ($0,$1,$2,$3,$4)",
            hash,id,purpose,address,DateTimeOffset.UtcNow.AddMinutes(purpose=="reset"?30:1440).ToString("O"));
        var url=origin+(purpose=="reset"?"/reset-password":"/verify-email")+"#token="+token;
        var subject=purpose=="reset"?"Reset your iSmartTech password":"Verify your iSmartTech email address";
        var body=purpose=="reset"
            ? "A password reset was requested for your iSmartTech account. Open this link to choose a new password:\n\n"+url+"\n\nThe link expires in 30 minutes and can be used once. If you did not request this, you can ignore this message. Your password has not changed."
            : "Please verify your iSmartTech email address by opening this link and selecting Verify email:\n\n"+url+"\n\nThe link expires in 24 hours and can be used once. If you did not create an account, you can ignore this message.";
        QueueCustomerEmail(address,subject,body,protector);
    }

    private Dictionary<string,object?> CustomerActionToken(string token,string purpose)
    {
        Check(token.Length==64 && token.All(Uri.IsHexDigit),"This link is invalid or expired. Request a new one.");
        var hash=Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
        var records=Query("""
            SELECT t.* FROM customer_action_tokens t JOIN customers c ON c.id=t.customer_id
            JOIN customer_credentials a ON a.customer_id=c.id
            WHERE t.token_hash=$0 AND t.purpose=$1 AND t.used_at IS NULL AND c.active=1
              AND t.email=c.email COLLATE NOCASE AND julianday(t.expires_at)>julianday('now')
            """,hash,purpose);
        Check(records.Count==1,"This link is invalid or expired. Request a new one.");return records[0];
    }

    public void VerifyCustomerEmail(string token)
    {
        var action=CustomerActionToken(token,"verify");var id=Number(action,"customer_id");
        Execute("INSERT INTO customer_security(customer_id,verified_email) VALUES ($0,$1) ON CONFLICT(customer_id) DO UPDATE SET verified_email=excluded.verified_email",id,action["email"]);
        Execute("UPDATE customer_action_tokens SET used_at=CURRENT_TIMESTAMP WHERE customer_id=$0 AND purpose='verify' AND used_at IS NULL",id);
    }

    private void SetCustomerPassword(long id,string password,IDataProtector protector)
    {
        Check(password.Length is >=12 and <=256,"Use a password between 12 and 256 characters.");
        var profile=CustomerProfile(id);var salt=Convert.ToHexString(RandomNumberGenerator.GetBytes(16));
        Execute("UPDATE customer_credentials SET salt=$0,password_hash=$1 WHERE customer_id=$2",salt,Convert.ToHexString(Hash(password,salt)),id);
        Execute("INSERT INTO customer_security(customer_id,credential_revision) VALUES ($0,2) ON CONFLICT(customer_id) DO UPDATE SET credential_revision=credential_revision+1",id);
        Execute("UPDATE customer_action_tokens SET used_at=CURRENT_TIMESTAMP WHERE customer_id=$0 AND purpose='reset' AND used_at IS NULL",id);
        QueueCustomerEmail((string)profile["email"]!,"Your iSmartTech password was changed",
            "Your iSmartTech password has been changed. Other signed-in sessions have been invalidated. If you did not make this change, contact the store immediately.",protector);
    }

    public void ChangeCustomerPassword(long id,string current,string password,IDataProtector protector)
    {
        Check(current.Length<=256 && AuthenticateCustomer((string)CustomerProfile(id)["email"]!,current)==id,"Your current password is incorrect.");
        Check(current!=password,"Choose a different new password.");
        SetCustomerPassword(id,password,protector);
    }

    public void ResetCustomerPassword(string token,string password,IDataProtector protector)
    {
        var action=CustomerActionToken(token,"reset");SetCustomerPassword(Number(action,"customer_id"),password,protector);
    }

    public void MarkCustomerMail(long id,bool sent) => Execute(
        "UPDATE customer_email_outbox SET attempts=attempts+1,last_attempt_at=CURRENT_TIMESTAMP,status=$0,sent_at=CASE WHEN $0='sent' THEN CURRENT_TIMESTAMP ELSE sent_at END,last_error=$1 WHERE id=$2 AND status='pending'",
        sent?"sent":"pending",sent?null:"Delivery failed. Check email transport configuration.",id);

    public object CustomerMailOutbox() => Query("SELECT id,recipient,subject,status,attempts,created_at,sent_at FROM customer_email_outbox ORDER BY id DESC LIMIT 100");
    public object CustomerMailOpen(long id,IDataProtector protector)
    {
        var mail=Row("SELECT id,recipient,subject,protected_body,status,created_at FROM customer_email_outbox WHERE id=$0",id);
        mail["body"]=protector.Unprotect((string)mail["protected_body"]!);mail.Remove("protected_body");return mail;
    }

    private Dictionary<string,object?> CustomerOrderView(long id)
    {
        var order=(Dictionary<string,object?>)CommerceOrder(id);order.Remove("created_by");
        if(order["customer"] is Dictionary<string,object?> customer)customer.Remove("price_tier");
        return order;
    }

    public object CustomerOrders(long customerId)
    {
        ExpireReservations();
        return Query("SELECT order_id FROM order_customers WHERE customer_id=$0 ORDER BY order_id DESC",customerId)
            .Select(row => {
                var order=CustomerOrderView(Number(row,"order_id"));
                order["requests"]=Query("""
                    SELECT r.id,r.sku,r.quantity,r.reason,r.status,x.amount_cents AS refunded_cents,x.reference AS refund_reference
                    FROM return_requests r LEFT JOIN refund_records x ON x.request_id=r.id WHERE r.order_id=$0 ORDER BY r.id
                    """,row["order_id"]);
                return order;
            }).ToArray();
    }

    private string StorefrontActor()
    {
        var service=Query("SELECT username FROM storefront_service WHERE id=1").FirstOrDefault();
        if(service!=null)return (string)service["username"]!;
        var username="_storefront_"+Guid.NewGuid().ToString("N");
        var salt=Convert.ToHexString(RandomNumberGenerator.GetBytes(16));
        Execute("INSERT INTO staff VALUES ($0,'sales',$1,$2)",username,salt,Convert.ToHexString(Hash(Convert.ToHexString(RandomNumberGenerator.GetBytes(32)),salt)));
        Execute("INSERT INTO storefront_service VALUES (1,$0)",username);
        return username;
    }

    private (List<JsonObject> Lines,long Products,long Installation,string InstallationDetails) CheckoutLines(long customerId,JsonObject data)
    {
        var customer=CustomerProfile(customerId);Check(Number(customer,"can_purchase")==1,"Purchasing is disabled for this account. Contact the store.");
        Check(Number(customer,"email_verified")==1,"Verify your email address in My Account before placing an order.");
        var catalogue=((List<JsonObject>)StorefrontProducts((string)customer["price_tier"]!)).ToDictionary(p=>p["sku"]!.GetValue<string>());
        var input=data["items"] as JsonArray ?? throw new ArgumentException("Add products to your cart.");
        Check(input.Count is >0 and <=100,"Add between 1 and 100 products.");
        var lines=new List<JsonObject>();var totalQuantities=new Dictionary<string,long>();
        long total=0,installation=0;var installationNotes=new List<string>();
        var kitGroups=new Dictionary<string,List<(JsonObject Product,long Quantity)>>();
        var installations=new HashSet<string>();
        foreach(var entry in input.OfType<JsonObject>())
        {
            var sku=CommerceText(entry,"sku");Check(catalogue.TryGetValue(sku,out var product),"A cart product is no longer available.");
            var qty=Positive(CommerceText(entry,"quantity"));
            Check(qty<=1000,"Order quantities must be at most 1000 per line.");
            Check(product!["priceOnRequest"]?.GetValue<bool>()!=true,"Contact the store for a price for "+sku+".");
            var unit=decimal.ToInt64(decimal.Round(product["price"]!.GetValue<decimal>()*100,0,MidpointRounding.AwayFromZero));
            var kit=CommerceText(entry,"kit",100);
            if(kit.Length>0)
            {
                if(!kitGroups.ContainsKey(kit))kitGroups[kit]=[];
                kitGroups[kit].Add((product,qty));
                var cats=product["categoryIds"]?.AsArray().Select(v=>v!.GetValue<int>()).ToArray()??[];
                if(cats.Any(id=>id is 13 or 14 or 15 or 16 or 17 or 18 or 19) && product["oldPrice"]==null)
                    unit=(long)decimal.Round(unit*0.9m,0,MidpointRounding.AwayFromZero);
                if(entry["installation"] is JsonObject install)
                {
                    Check(installations.Add(kit),"Only one installation selection is allowed per kit.");
                    var storeys=Positive(CommerceText(install,"storeys"));Check(storeys<=3,"Choose one to three storeys.");
                    var noRoof=install["noRoofAccess"]?.GetValue<bool>()??false;
                    installation+=(60+storeys*30+(noRoof?30:0))*100;
                    installationNotes.Add($"{storeys} storey(s); roof access: {(noRoof?"no":"yes")}");
                }
            }
            else Check(entry["installation"]==null,"Installation must be attached to a complete CCTV kit.");
            totalQuantities[sku]=totalQuantities.GetValueOrDefault(sku)+qty;
            total+=unit*qty;
            lines.Add(new JsonObject{["sku"]=sku,["name"]=product["name"]!.DeepClone(),["quantity"]=qty,["unit_cents"]=unit,["line_cents"]=unit*qty});
        }
        Check(lines.Count==input.Count,"Invalid cart entry.");
        foreach(var (sku,qty) in totalQuantities) Check(qty<=catalogue[sku]["stock"]!.GetValue<long>(),"Insufficient available stock for "+sku+". Update your cart.");
        foreach(var group in kitGroups.Values)
        {
            bool HasCategory(JsonObject p,params int[] ids)=>p["categoryIds"] is JsonArray cats && cats.Any(id=>ids.Contains(id!.GetValue<int>()));
            var cameras=group.Where(line=>HasCategory(line.Product,13,14,15,16,17)).ToArray();
            var recorders=group.Where(line=>HasCategory(line.Product,18,19)).ToArray();
            var drives=group.Where(line=>System.Text.RegularExpressions.Regex.IsMatch(line.Product["name"]+" "+line.Product["category"],"hard\\s*drive|hdd|skyhawk|wd purple",System.Text.RegularExpressions.RegexOptions.IgnoreCase)).ToArray();
            Check(cameras.Length>0 && recorders.Length==1 && recorders[0].Quantity==1 && drives.Length>0,"A CCTV kit requires cameras, one recorder and storage.");
            var brand=recorders[0].Product["brand"]!.GetValue<string>().Trim().ToLowerInvariant();
            foreach(var line in cameras)
            {
                var cameraBrand=line.Product["brand"]!.GetValue<string>().Trim().ToLowerInvariant();
                Check(cameraBrand==brand || new[]{"uniview","uniarch"}.Contains(cameraBrand)&&new[]{"uniview","uniarch"}.Contains(brand),"Kit camera and recorder brands are incompatible.");
            }
            var channelTags=new Dictionary<int,int>{{225,4},{226,8},{227,16},{261,24},{228,32},{229,64}};
            var tags=recorders[0].Product["tagIds"]?.AsArray().Select(v=>v!.GetValue<int>()).ToArray()??[];
            var capacity=tags.Where(channelTags.ContainsKey).Select(tag=>channelTags[tag]).DefaultIfEmpty(0).Max();
            Check(capacity>0 && cameras.Sum(line=>line.Quantity)<=capacity,"Kit camera quantity exceeds verified recorder capacity.");
            var sataTags=new Dictionary<int,int>{{257,1},{258,2},{259,4},{260,8}};
            var bays=tags.Where(sataTags.ContainsKey).Select(tag=>sataTags[tag]).DefaultIfEmpty(0).Max();
            Check(bays>0 && drives.Sum(line=>line.Quantity)<=bays,"Kit storage exceeds the recorder's verified drive-bay count.");
        }
        // Order lines snapshot a weighted unit price when the same SKU occurs in multiple kits.
        Check(lines.GroupBy(line=>line["sku"]!.GetValue<string>()).All(group=>group.Select(line=>line["unit_cents"]!.GetValue<long>()).Distinct().Count()==1),
            "The same product has different standard and kit prices. Place those purchases as separate orders.");
        return (lines,total,installation,string.Join("; ",installationNotes));
    }

    public object CustomerCheckout(long customerId,JsonObject data,bool place)
    {
        ExpireReservations();
        var key=CommerceText(data,"request_key",100);
        var fingerprint=Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(data.ToJsonString())));
        if(place)
        {
            Check(Guid.TryParse(key,out _),"Invalid checkout reference. Refresh the checkout.");
            var existing=Query("SELECT order_id,fingerprint FROM customer_checkouts WHERE customer_id=$0 AND request_key=$1",customerId,key).FirstOrDefault();
            if(existing!=null){Check(Equals(existing["fingerprint"],fingerprint),"This checkout reference was already used. Start a new checkout.");return CustomerOrderView(Number(existing,"order_id"));}
        }
        var address=CommerceText(data,"address",2000);var phone=CommerceText(data,"phone",100);
        Check(!place || (address.Length>=5 && phone.Length>=3),"Enter your delivery address and contact phone number.");
        var checkout=CheckoutLines(customerId,data);
        long? shipping=null;
        var summary=new{lines=checkout.Lines,subtotal_cents=checkout.Products,installation_cents=checkout.Installation,shipping_cents=shipping,total_cents=checkout.Products+checkout.Installation+(shipping??0),shipping_pending=shipping==null};
        if(!place)return summary;
        Check(data["expected_total_cents"]?.GetValue<long>()==summary.total_cents,"Prices changed. Review checkout before placing your order.");
        var customer=CustomerProfile(customerId);var actor=StorefrontActor();
        var id=Number(Row("INSERT INTO orders(expires_at,created_by) VALUES ($0,$1) RETURNING id",DateTimeOffset.UtcNow.AddDays(7).ToString("O"),actor),"id");
        foreach(var group in checkout.Lines.GroupBy(line=>line["sku"]!.GetValue<string>()))
            Execute("INSERT INTO order_lines VALUES ($0,$1,$2,$3)",id,group.Key,group.Sum(line=>line["quantity"]!.GetValue<long>()),group.First()["unit_cents"]!.GetValue<long>());
        Execute("INSERT INTO order_customers VALUES ($0,$1,$2,$3,$4)",id,customerId,customer["name"],customer["email"],customer["price_tier"]);
        Execute("INSERT INTO fulfilments(order_id,method,address,collection_contact,notes) VALUES ($0,'delivery',$1,$2,$3)",id,address,customer["name"],"Contact phone: "+phone);
        Execute("INSERT INTO order_charges VALUES ($0,$1,$2,$3)",id,shipping,checkout.Installation,checkout.InstallationDetails);
        Transition(new Arguments("reserve",actor,"",[id.ToString()]));
        Execute("INSERT INTO customer_checkouts VALUES ($0,$1,$2,$3)",customerId,key,fingerprint,id);
        Execute("INSERT INTO audit(actor,action,details) VALUES ($0,'customer-checkout',$1)",actor,JsonSerializer.Serialize(new{customer_id=customerId,order_id=id}));
        QueueOrderNotification(id,"received");
        return CustomerOrderView(id);
    }

    public object CustomerUpdate(long id,JsonObject data)
    {
        CustomerProfile(id);
        var name=CommerceText(data,"name",200);Check(name.Length>0,"Enter your name.");
        Check(Execute("UPDATE customers SET name=$0,phone=$1,address=$2,company=$3,version=version+1 WHERE id=$4 AND version=$5",name,
            CommerceText(data,"phone",100),CommerceText(data,"address",2000),CommerceText(data,"company",200),id,Positive(CommerceText(data,"version")))==1,
            "Your details changed. Refresh your account before saving.");
        return CustomerProfile(id);
    }

    public object CustomerReturn(long id,JsonObject data)
    {
        CustomerProfile(id);var order=Positive(CommerceText(data,"order_id"));
        Check(Query("SELECT 1 FROM order_customers WHERE order_id=$0 AND customer_id=$1",order,id).Count==1,"Order not found.");
        var actor=StorefrontActor();
        var result=Commerce(new Arguments("return-request",actor,"",[data.ToJsonString()]),"sales");
        Execute("INSERT INTO audit(actor,action,details) VALUES ($0,'customer-return-request',$1)",actor,JsonSerializer.Serialize(new{customer_id=id,order_id=order}));
        return result;
    }

    private static readonly HashSet<string> ContentFields =
    [
        "name","brand","category","active","kind","channels","shortDescription","description","features",
        "specifications","categoryIds","tagIds","image","galleryImages","featureImages","colors",
        "datasheetUrl","specSheetLinks","sourceUrl","badge","icon","accent","rating","reviews",
        "featured","featuredOrder","isAssembled","subProducts","detailContent","includedItems","translations"
    ];

    private static void Text(JsonNode? value, string key, int limit = 50000)
    {
        Check(value is JsonValue text && text.TryGetValue<string>(out var content) && content.Length <= limit,
            $"Invalid text field: {key}.");
    }

    private static void Url(JsonNode? value, string key)
    {
        Text(value, key, 2000);
        var url = value!.GetValue<string>();
        Check(url.Length == 0 || (url.StartsWith('/') && !url.StartsWith("//") && !url.Contains('\\')) ||
            Uri.TryCreate(url, UriKind.Absolute, out var parsed) && parsed.Scheme == "https" && parsed.UserInfo.Length == 0,
            $"Use a relative path or HTTPS URL for {key}.");
    }

    private static void TextArray(JsonNode? value, string key, bool urls = false)
    {
        Check(value is JsonArray, $"Expected a list for {key}.");
        foreach (var item in value!.AsArray())
            if (urls) Url(item, key); else Text(item, key);
    }

    private static void Specifications(JsonNode? value, string key)
    {
        Check(value is JsonObject, $"Expected named values for {key}.");
        foreach (var entry in value!.AsObject()) Text(entry.Value, key);
    }

    private static void PairsContent(JsonNode? value, string key)
    {
        Check(value is JsonArray, $"Expected title and description pairs for {key}.");
        foreach (var pair in value!.AsArray())
        {
            Check(pair is JsonArray list && list.Count == 2, $"Expected title and description pairs for {key}.");
            foreach (var cell in pair!.AsArray()) Text(cell, key);
        }
    }

    private static void ValidateContent(JsonObject data)
    {
        foreach (var (key, value) in data)
        {
            Check(ContentFields.Contains(key), $"Unsupported product field: {key}.");
            if (value == null && key is "channels") continue;
            switch (key)
            {
                case "active":
                case "featured":
                case "isAssembled":
                    Check(value is JsonValue flag && flag.TryGetValue<bool>(out _), $"Invalid checkbox: {key}.");
                    break;
                case "channels":
                case "rating":
                case "featuredOrder":
                case "reviews":
                    Check(value is JsonValue number && number.TryGetValue<decimal>(out var amount) &&
                        amount >= 0 && (key != "rating" || amount <= 5) &&
                        (key == "rating" || amount == decimal.Truncate(amount)), $"Invalid number: {key}.");
                    break;
                case "image":
                case "datasheetUrl":
                case "sourceUrl":
                    Url(value, key);
                    break;
                case "features":
                case "colors":
                case "galleryImages":
                case "featureImages":
                    TextArray(value, key, key is "galleryImages" or "featureImages");
                    break;
                case "categoryIds":
                case "tagIds":
                    Check(value is JsonArray, $"Expected numeric IDs for {key}.");
                    foreach (var item in value!.AsArray())
                        Check(item is JsonValue id && id.TryGetValue<int>(out var numeric) && numeric > 0, $"Invalid ID in {key}.");
                    break;
                case "specifications":
                    Specifications(value, key);
                    break;
                case "specSheetLinks":
                case "includedItems":
                case "subProducts":
                    Check(value is JsonArray, $"Expected rows for {key}.");
                    foreach (var item in value!.AsArray())
                    {
                        Check(item is JsonObject, $"Invalid row in {key}.");
                        var allowed = key == "specSheetLinks" ? new[] { "label","url" } :
                            key == "includedItems" ? new[] { "label","productId" } : new[] { "id","name","sku" };
                        foreach (var (property, cell) in item!.AsObject())
                        {
                            Check(allowed.Contains(property), $"Unsupported {key} field: {property}.");
                            if (property == "url") Url(cell, key); else Text(cell, key);
                        }
                        var required = key == "subProducts" ? "name" : "label";
                        Check(item[required] != null, $"Missing {required} in {key}.");
                        if (key == "specSheetLinks") Url(item["url"], key);
                    }
                    break;
                case "detailContent":
                    Check(value is JsonObject, "Invalid extended detail content.");
                    foreach (var (section, content) in value!.AsObject())
                    {
                        if (section is "overview" or "why") Text(content, section);
                        else if (section is "applications" or "installationNotes") TextArray(content, section);
                        else
                        {
                            Check(section is "capabilities" or "recommendedApplications" or "idealUseCases",
                                $"Unknown detail section: {section}.");
                            PairsContent(content, section);
                        }
                    }
                    break;
                case "translations":
                    Check(value is JsonObject, "Invalid translations.");
                    foreach (var (language, content) in value!.AsObject())
                    {
                        Check(language == "zh" && content is JsonObject, "Only the zh translation is supported.");
                        foreach (var (field, cell) in content!.AsObject())
                        {
                            if (field == "features") TextArray(cell, field);
                            else if (field == "specifications") Specifications(cell, field);
                            else
                            {
                                Check(field is "name" or "description" or "shortDescription", "Unknown translation field.");
                                Text(cell, field);
                            }
                        }
                    }
                    break;
                default:
                    Text(value, key);
                    break;
            }
        }
    }

    private object SaveProductContent(string sku, string json)
    {
        var data = JsonNode.Parse(json) as JsonObject ?? throw new ArgumentException("Invalid product content.");
        ValidateContent(data);
        sku = CleanProductSku(sku);
        if (Query("SELECT 1 FROM products WHERE sku=$0", sku).Count == 0)
        {
            foreach (var field in new[] { "name","brand","category" })
                Check(!string.IsNullOrWhiteSpace(data[field]?.GetValue<string>()), $"Enter {field}.");
            Execute("INSERT INTO products(sku,name,brand,category,active) VALUES ($0,$1,$2,$3,1)",
                sku, data["name"]!.GetValue<string>(), data["brand"]!.GetValue<string>(), data["category"]!.GetValue<string>());
        }
        var current = ProductContent(sku);
        foreach (var field in new[] { "name","brand","category" })
            Check(!string.IsNullOrWhiteSpace(data[field]?.GetValue<string>() ?? current[field]!.GetValue<string>()), $"Enter {field}.");
        foreach (var (key, value) in data) current[key] = value?.DeepClone();
        var kind = current["kind"]!.GetValue<string>();
        var channels = current["channels"]?.GetValue<long>();
        Execute("""
            UPDATE products SET name=$0,brand=$1,category=$2,active=$3,kind=$4,channels=$5 WHERE sku=$6
            """, CleanProductName(current["name"]!.GetValue<string>()), current["brand"]!.GetValue<string>(),
            current["category"]!.GetValue<string>(), current["active"]!.GetValue<bool>(), kind, channels, sku);
        var routeId = current["id"]!.GetValue<string>();
        foreach (var field in new[] { "id","sku","name","brand","category","active","kind","channels" }) current.Remove(field);
        // Commercial values are always resolved from inventory and tier tables at read time.
        Execute("""
            INSERT INTO storefront_content(sku,route_id,payload) VALUES ($0,$1,$2)
            ON CONFLICT(sku) DO UPDATE SET payload=excluded.payload,updated_at=CURRENT_TIMESTAMP
            """, sku, routeId, current.ToJsonString());
        return ProductContent(sku);
    }
}
