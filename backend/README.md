local retail backend

Run these commands from the iSmartTech project root. The backend uses the .NET 8 SDK, ASP.NET Core, and Microsoft.Data.Sqlite. It has a separate database under `outputs/`, and the read-only HTTP server binds to the Mac's loopback address. The storefront deployment does not use this backend.

```sh
dotnet run --project backend -- init owner
dotnet run --project backend -- import outputs/Inventory-Priced.csv
dotnet run --project backend -- serve
```

In another terminal:

```sh
curl http://127.0.0.1:8787/health
curl 'http://127.0.0.1:8787/products?q=Dahua'
dotnet run --project backend -- --help
```

If you already initialized the Python backend, use your existing staff login and skip `init`. The C# backend opens the same SQLite database. The first build restores a NuGet package.

Initial import seeds opening stock and product records. Rows with blank prices remain in the catalogue. A repeat import skips existing SKUs to preserve staff changes. The price CSV retains the source stock and active flags. Supplier costs, tax treatment, and actual company pricing policies require company confirmation.

Create staff accounts with `staff <username> <sales|warehouse|finance>`. Pass `--actor <username>` before the command to operate under that account. These roles apply through the CLI. Staff sharing the same operating-system account and database file must be trusted with file access. Public HTTP endpoints expose active catalogue data and stock availability only. Administrative commands prompt for a password.

The following example uses fictitious SKUs and a separate database. Run each command with the prefix `dotnet run --project backend -- --db outputs/retail-demo.sqlite`, beginning with `init owner`:

```text
product DEMO-CAM "Demo camera" Demo Cameras --kind camera
product DEMO-NVR "Demo recorder" Demo Recorders --kind recorder --channels 4
receive DEMO-CAM 2 "Opening stock"
receive DEMO-NVR 1 "Opening stock"
tier-set DEMO-CAM "S · Trade Price" 10000
tier-set DEMO-NVR "S · Trade Price" 30000
compatibility DEMO-NVR DEMO-CAM
kit DEMO-NVR DEMO-CAM=2
reserve 1
pay 1 TEST-PAYMENT-1
dispatch 1 --serial DEMO-CAM=CAM-001,CAM-002 --serial DEMO-NVR=NVR-001
return 1 DEMO-CAM 1 "Failed inspection" --serial CAM-001
order 1
inventory DEMO-CAM
audit
```

Prices and refunds are in cents. Payment references and refunds are local records for testing. Serial-tracked products require a serial at dispatch. A return is only added to sellable stock when `--sellable` is explicitly supplied after inspection. Use `cancel <id>` to release an unpaid reservation. The next inventory query or reservation operation releases expired reservations.

To back up a database with SQLite installed, run `sqlite3 outputs/retail.sqlite ".backup outputs/retail-backup.sqlite"`. Inspect the backup using `sqlite3 outputs/retail-backup.sqlite "PRAGMA integrity_check;"` and open it with the CLI's `--db` option to verify it can be used.

This first workflow covers one location and full dispatch, with partial returns. Supplier purchase orders, trade price lists and discount approval, receiving serials, split fulfilment, accounting and courier integrations, GST invoices, and live payment processing are follow-on work. Configure verified product types and compatibility before quoting a real kit.

### Akubela and Akuvox workbook updates

Run these as Owner from the iSmartTech root. Preview lists the affected SKUs,
stock differences, and exceptions. Import records the source and applies the
snapshot in one transaction. The same workbook can only be applied once per database.

```sh
dotnet run --project backend -- workbook-preview "$HOME/Downloads/IoT-Tech-Akubela-Akuvox-Prices-and-Stock.xlsx"
dotnet run --project backend -- workbook-import "$HOME/Downloads/IoT-Tech-Akubela-Akuvox-Prices-and-Stock.xlsx"
dotnet run --project backend -- reorder-report 2 Akuvox
dotnet run --project backend -- tiers BAC-006MZB
```

Stock is reconciled to reported on-hand units, subject to existing reservations.
A negative stock row or a count below reservations is reported and its stock stays
as it was. Blank workbook cells leave existing costs and tier prices intact. New quotes use Price (S) → Trade Price unless a tier is selected explicitly. The inventory CSV supplies product and stock information. New rows use
the Uncategorised category. The catalogue API exposes the source product URL
where supplied. The workbook's embedded images are excluded.

Finance or Owner can use `tier-set SKU "S · Trade Price" CENTS` or
`tier-remove SKU "S · Trade Price"`. Sales and Owner can explicitly select a tier
with `quote SKU=1 --tier "S · Trade Price"` or `kit ... --tier "S · Trade Price"`.
The tier must have a positive price for every SKU in the quote. Existing quotes
keep their original unit prices. Set quantity eligibility in business policy
before offering automatic quantity pricing. Tier values are staff-only.

### Staff web application

Start the backend with `dotnet run --project backend -- serve` and open
`http://127.0.0.1:8787/admin`. Use the same staff account as for terminal
commands. The first Owner is created through the terminal with `init owner`.
Uploads use the local database, and workbook preview lets you review stock
changes before applying the import.

For a public deployment, publish `backend/Retail.csproj` to an ASP.NET Core
host with a persistent volume. Run the published app with an absolute
`--db /path/to/persistent/retail.sqlite` path. Set
`ISMARTTECH_PUBLIC_ADMIN=1` and configure an HTTPS endpoint in Kestrel using
`ASPNETCORE_URLS` and the host's certificate settings. Keep the database outside
the public web directory and back it up. Serve the UI and admin API together
on the same HTTPS origin. The existing storefront's static/Worker host does
not run this C# process.
