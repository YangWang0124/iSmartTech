using System.Globalization;
using System.IO.Compression;
using System.Security.Cryptography;
using System.Text.Json;
using System.Xml.Linq;

sealed partial class RetailStore
{
    private static readonly string[] WorkbookTiers =
    [
        "S · Trade Price", "S · (E) with QTY", "S · (S) with BIG QTY", "S · 1.53", "S · 1.5", "S · 1.45",
        "S · 1.38 Wholesaler Tier 1", "P · (E) with QTY", "P · (S) with BIG QTY", "P · 1.53", "P · 1.5",
        "P · 1.45", "P · 1.38 Wholesaler Tier 1"
    ];

    private void SetTier(string sku, string tier, long cents)
    {
        Check(WorkbookTiers.Contains(tier), $"Unknown price tier: {tier}");
        Execute("""
            INSERT INTO product_price_tiers VALUES ($0,$1,$2)
            ON CONFLICT(sku,tier) DO UPDATE SET cents=excluded.cents
            """, sku, tier, cents);
    }

    private object ImportWorkbook(string path, string actor, bool preview)
    {
        using var file = File.OpenRead(path);
        var fingerprint = Convert.ToHexString(SHA256.HashData(file));
        var previous = Query("SELECT report FROM workbook_imports WHERE fingerprint=$0", fingerprint).FirstOrDefault();
        if (previous != null)
            return new { already_applied = true, report = JsonSerializer.Deserialize<JsonElement>((string)previous["report"]!) };

        file.Position = 0;
        var source = Path.GetFileName(path);
        var changes = new List<object>();
        var issues = new List<object>();
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var inserted = 0;
        var updated = 0;
        var tierCount = 0;
        var stockChanges = 0;
        foreach (var fields in ReadWorkbook(file))
        {
            var sku = CleanProductSku(fields["Series number / SKU"]);
            var name = CleanProductName(fields["Product name"]);
            var brand = fields["Brand"].Trim();
            var active = fields["Active"];
            Check(sku.Length > 0 && seen.Add(sku), $"Blank or duplicate SKU: {sku}");
            Check(name.Length > 0 && brand.Length > 0 && active is "Yes" or "No", $"Invalid product fields: {sku}");
            var stock = int.Parse(fields["Stock"], CultureInfo.InvariantCulture);
            var cost = Money(fields["Cost"]);
            Check(cost is null or > 0, $"Invalid cost for {sku}.");
            var current = Query("SELECT * FROM inventory WHERE sku=$0", sku).FirstOrDefault();
            Check(current == null || string.Equals((string?)current["brand"], brand, StringComparison.OrdinalIgnoreCase),
                $"Workbook brand conflicts with the existing SKU {sku}.");
            if (current == null) inserted++;
            else updated++;
            var onHand = current == null ? 0 : Number(current, "on_hand");
            var reserved = current == null ? 0 : Number(current, "reserved");
            var canUpdateStock = stock >= reserved;
            if (!canUpdateStock) issues.Add(new { sku, reported_stock = stock, reserved, reason = "Reported stock is below zero or reserved stock" });
            if (canUpdateStock && stock != onHand) stockChanges++;
            var tiers = WorkbookTiers.Select(tier => (tier, cents: Money(fields[tier]))).Where(entry => entry.cents.HasValue).ToArray();
            tierCount += tiers.Length;
            if (tiers.Any(entry => entry.cents == 0))
                issues.Add(new { sku, reason = "Zero tier price recorded for review and unavailable for quotes" });
            changes.Add(new { sku, name, brand, is_new = current == null, active = active == "Yes",
                previous_stock = onHand, reported_stock = stock, stock_applied = canUpdateStock,
                previous_active = current == null ? (bool?)null : Number(current, "active") != 0,
                tiers = tiers.Length });
            if (preview) continue;

            Execute("""
                INSERT INTO products(sku,name,brand,category,active,cost_cents)
                VALUES ($0,$1,$2,'Uncategorised',$3,$4)
                ON CONFLICT(sku) DO UPDATE SET name=excluded.name, active=excluded.active,
                    cost_cents=COALESCE(excluded.cost_cents,products.cost_cents)
                """, sku, name, brand, active == "Yes", cost);
            if (Uri.TryCreate(fields["IoT Tech website"], UriKind.Absolute, out var link) &&
                link.Scheme == Uri.UriSchemeHttps && link.Host == "www.iottech.co.nz")
                Execute("""
                    INSERT INTO product_source_links VALUES ($0,$1)
                    ON CONFLICT(sku) DO UPDATE SET url=excluded.url
                    """, sku, link.AbsoluteUri);
            if (canUpdateStock && stock != onHand)
                Move(sku, stock - onHand, 0, $"Stock reconciliation: {source}", actor);
            foreach (var (tier, cents) in tiers) SetTier(sku, tier, cents!.Value);
        }

        Check(seen.Count > 0, "Workbook contains no product rows.");
        var summary = new { inserted, existing_skus = updated, stock_changes = stockChanges, tier_values = tierCount, issues };
        if (!preview)
            Execute("INSERT INTO workbook_imports(fingerprint,filename,actor,report) VALUES ($0,$1,$2,$3)",
                fingerprint, source, actor, JsonSerializer.Serialize(summary));
        return preview ? new { summary, changes } : summary;
    }

    private static long? Money(string value)
    {
        if (string.IsNullOrWhiteSpace(value) || value.Trim() == "--") return null;
        var cents = decimal.Parse(value, NumberStyles.Number | NumberStyles.AllowExponent, CultureInfo.InvariantCulture) * 100;
        Check(cents >= 0 && cents <= int.MaxValue && decimal.Abs(cents - decimal.Round(cents)) < 0.000001m,
            $"Invalid money value: {value}");
        return (long)decimal.Round(cents);
    }

    private static IEnumerable<Dictionary<string, string>> ReadWorkbook(Stream file)
    {
        using var archive = new ZipArchive(file, ZipArchiveMode.Read);
        var workbook = Load(archive, "xl/workbook.xml");
        var sheet = workbook.Descendants().SingleOrDefault(e => e.Name.LocalName == "sheet" && (string?)e.Attribute("name") == "Product Prices");
        Check(sheet != null, "Missing Product Prices sheet.");
        var id = sheet!.Attributes().Single(a => a.Name.LocalName == "id").Value;
        var relation = Load(archive, "xl/_rels/workbook.xml.rels").Root!.Elements().Single(e => (string?)e.Attribute("Id") == id);
        var target = (string)relation.Attribute("Target")!;
        var sheetPath = target.StartsWith('/') ? target.TrimStart('/') : "xl/" + target;
        var shared = archive.GetEntry("xl/sharedStrings.xml") == null ? [] :
            Load(archive, "xl/sharedStrings.xml").Root!.Elements().Select(CellText).ToArray();
        Dictionary<string, string>? header = null;
        foreach (var row in Load(archive, sheetPath).Descendants().Where(e => e.Name.LocalName == "row"))
        {
            var cells = row.Elements().Where(e => e.Name.LocalName == "c").ToDictionary(
                e => new string(((string)e.Attribute("r")!).TakeWhile(char.IsLetter).ToArray()), e =>
                {
                    var formula = e.Elements().FirstOrDefault(v => v.Name.LocalName == "f")?.Value;
                    if (formula != null && formula.StartsWith("HYPERLINK(\"", StringComparison.OrdinalIgnoreCase))
                        return formula.Split('"')[1];
                    var value = e.Elements().FirstOrDefault(v => v.Name.LocalName == "v")?.Value ?? "";
                    return (string?)e.Attribute("t") switch
                    {
                        "s" => shared[int.Parse(value, CultureInfo.InvariantCulture)],
                        "inlineStr" => CellText(e),
                        _ => value
                    };
                });
            if (header == null)
            {
                if (!cells.Values.Contains("Series number / SKU")) continue;
                var required = new[] { "Product name", "Series number / SKU", "Brand", "Cost", "Stock", "Active", "IoT Tech website" }.Concat(WorkbookTiers);
                header = required.ToDictionary(name => name, name => cells.SingleOrDefault(cell => cell.Value == name).Key
                    ?? throw new ArgumentException($"Missing workbook column: {name}"));
                continue;
            }
            var fields = header.ToDictionary(entry => entry.Key, entry => cells.GetValueOrDefault(entry.Value, ""));
            if (fields.Values.Any(value => !string.IsNullOrWhiteSpace(value))) yield return fields;
        }
        Check(header != null, "Missing product headers.");
    }

    private static string CellText(XElement element) =>
        string.Concat(element.Descendants().Where(e => e.Name.LocalName == "t").Select(e => e.Value));

    private static XDocument Load(ZipArchive archive, string path)
    {
        var entry = archive.GetEntry(path) ?? throw new ArgumentException($"Missing workbook entry: {path}");
        using var stream = entry.Open();
        return XDocument.Load(stream);
    }
}
