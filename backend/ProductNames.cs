using System.Text.RegularExpressions;

sealed partial class RetailStore
{
    private const string StatusMigration = "remove-inactive-from-product-identifiers";
    private static readonly Regex InactivePrefix = new(
        @"^(?:\s*[(（]\s*inactive\s*[)）]\s*)+", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

    private static string CleanProductName(string value)
    {
        var cleaned = InactivePrefix.Replace(value, "").Trim();
        Check(cleaned.Length > 0, "Product name or SKU is empty after removing its status marker.");
        return cleaned;
    }

    private static string CleanProductSku(string value)
    {
        var sku = CleanProductName(value);
        // The workbook also contains an archived actuator with its own source URL.
        // Its base SKU is already used by an active actuator record.
        return sku.Equals("KXAC-B1R8A16(Inactive", StringComparison.OrdinalIgnoreCase)
            ? "KXAC-B1R8A16-LEGACY"
            : sku;
    }

    private bool StatusMigrationApplied() =>
        Query("SELECT 1 FROM retail_migrations WHERE name=$0", StatusMigration).Count != 0;

    private void RemoveLegacyStatusMarkers()
    {
        if (StatusMigrationApplied()) return;
        Transaction(() =>
        {
            if (StatusMigrationApplied()) return true;
            var products = Query("SELECT sku,name FROM products")
                .Select(row =>
                {
                    var sku = (string)row["sku"]!;
                    var name = (string)row["name"]!;
                    return (sku, name, newSku: CleanProductSku(sku), newName: CleanProductName(name));
                }).ToArray();
            var existing = products.Select(item => item.sku).ToHashSet(StringComparer.OrdinalIgnoreCase);
            foreach (var item in products.Where(item => item.sku != item.newSku))
            {
                Check(existing.Add(item.newSku), $"Status cleanup would duplicate SKU {item.newSku}.");
            }

            Execute("PRAGMA defer_foreign_keys=ON");
            foreach (var item in products)
            {
                if (item.sku != item.newSku)
                {
                    foreach (var table in new[] { "stock_movements", "order_lines", "dispatched_units", "returns",
                                 "product_price_tiers", "product_source_links" })
                        Execute($"UPDATE {table} SET sku=$0 WHERE sku=$1", item.newSku, item.sku);
                    Execute("UPDATE compatibility SET recorder=$0 WHERE recorder=$1", item.newSku, item.sku);
                    Execute("UPDATE compatibility SET component=$0 WHERE component=$1", item.newSku, item.sku);
                }
                if (item.sku != item.newSku || item.name != item.newName)
                    Execute("UPDATE products SET sku=$0,name=$1 WHERE sku=$2", item.newSku, item.newName, item.sku);
            }

            Execute("INSERT INTO retail_migrations VALUES ($0)", StatusMigration);
            return true;
        });
    }
}
