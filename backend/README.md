local retail backend

Run these commands from the iSmartTech project root. The backend uses the .NET 8 SDK, ASP.NET Core, and Microsoft.Data.Sqlite. It has a separate database under `outputs/`, and the HTTP server binds to the Mac's loopback address. The local storefront reads its product records from this backend. See the shared catalogue section for hosting configuration.

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

This first workflow covers one location and full dispatch, with partial returns. Supplier purchase orders, automatic quantity pricing and discount approval, receiving serials, split fulfilment, accounting and courier integrations, GST invoices, and live payment processing are follow-on work. Configure verified product types and compatibility before quoting a real kit.

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
Product image uploads use the local database. Import commands remain available through the CLI; the web navigation contains Inventory, Orders, Shipping, Customers, Returns and refunds, and Access.

For a public deployment, publish `backend/Retail.csproj` to an ASP.NET Core
host with a persistent volume. Run the published app with an absolute
`--db /path/to/persistent/retail.sqlite` path. Set
`ISMARTTECH_PUBLIC_ADMIN=1` and configure an HTTPS endpoint in Kestrel using
`ASPNETCORE_URLS` and the host's certificate settings. Keep the database outside
the public web directory and back it up. Serve the UI and admin API together
on the same HTTPS origin. The existing storefront's static/Worker host does
not run this C# process.

### Shared storefront catalogue

The storefront now reads `/api/retail/products` from this backend. Both the staff
interface and the storefront use the same SQLite records. Vite proxies that
endpoint to `http://127.0.0.1:8787` by default. Set `RETAIL_BACKEND_URL` in the
Vite environment to use another development backend.

In Inventory, choose Edit to maintain the product name, brand, category,
publication state, descriptions, features, specifications, media URLs,
documents, variants, included items, homepage selection and Chinese translation.
Costs and workbook price tiers remain in Pricing. Stock adjustments remain
in Adjust stock. Extended nested content currently uses labelled JSON fields.

The one-time catalogue migration imports public product content from
`catalogue-seed.json` and preserves existing inventory stock, price tiers and
active status. It adds storefront SKUs missing from inventory with zero stock
and no invented price. Existing product URLs are retained through route IDs
and aliases. After migration the database owns the content, and the seed does
not overwrite later staff edits.

The frontend refreshes the catalogue on window focus and every 30 seconds.
Archived products are excluded. A missing workbook price displays Price on
request. The original API and bundled records no longer override these values.
The development frontend and built frontend both use this endpoint. After
`npm run build`, the .NET server can serve the built storefront at its root.

For the hosted Cloudflare storefront, configure the Worker environment variable
`RETAIL_BACKEND_URL` to the deployed HTTPS C# host before publishing the new
frontend. The Cloudflare runtime proxies catalogue requests to that host.
The local Mac setup alone does not supply a public C# service.

### Online-store administration workflows

Orders links each new staff-created order to an eligible customer and snapshots
that customer's name, email and company price tier. Product prices are resolved
from the existing price-tier tables, then stock is reserved atomically. Disabling
a customer or purchasing permission prevents new orders. Customer edits use a
version check to reject stale forms; existing orders retain their customer snapshot.

Payments record money already received outside this application. The reference
must be unique, the amount must match the order total, and repeated submissions
cannot record the same payment twice. This is not a payment gateway integration.

Shipping supports delivery addresses, carriers and tracking numbers. Pickup is not offered. Payment is required before marking ready to ship or dispatching. Dispatch consumes reserved stock once. Completed
fulfilments cannot be edited or dispatched again. Optimistic version checks
prevent stale fulfilment forms from overwriting concurrent changes.

Returns move through requested, approved/rejected, then received. Quantities
cannot exceed fulfilled quantities or overlap pending requests. Receiving an
inspected sellable return restores stock; damaged goods do not increase sellable
stock. Refunds record an externally completed refund and its transaction reference,
limited to the received return's value. Duplicate refund submissions cannot create
multiple records. Previously recorded returns remain visible separately.

The storefront now connects registration, customer sign-in, account details, assigned-tier prices, checkout, order/tracking history and return requests to these records. No card charge, bank transfer, courier booking or customer email is sent automatically.

Owner has full access. Sales manages customers and orders; Finance records
payments and refunds; Warehouse prepares shipments. Warehouse and Finance can
inspect returns. Changes are recorded in the existing audit log. The new tables
are additive; existing inventory, pricing, order and return records are retained.

### Connected customer storefront

Customer accounts use a separate HttpOnly, SameSite=Strict cookie scheme, salted
PBKDF2 hashes (600,000 SHA-256 iterations), and per-IP sign-in/registration rate
limits. Customer cookies cannot access staff APIs; staff cookies do not establish
a customer session. Active status is checked on every authenticated customer
request. Purchasing permission and the current company price tier are checked
again when calculating checkout. Profiles cannot modify email, permissions or
price tiers. Customer order history and return requests are scoped to the signed-in
customer. Customer and catalogue responses use no-store caching.

New customers can register. Existing customer records require a single-use,
48-hour invitation issued from Customers > Sign-up invitation. Share that code
with the correct customer yourself; it is not emailed automatically. Reissuing an
invitation invalidates the previous code. Registration never claims an existing
customer's assigned prices by email alone. Old browser-only demo accounts are not
server accounts and must register once; their old hashes are not imported.

The cart requests a server-calculated review, then places an idempotent order using
a stable checkout reference. Unit prices, discounts and stock come from the current
backend, not browser totals. Complete CCTV kits retain the existing 10% eligible
camera/recorder discount; brand, channel and drive-bay limits are checked again.
Installation is charged only when selected and is calculated from the existing
storeys/roof-access rule. Orders snapshot prices and reserve stock atomically.
Duplicate or retried submissions do not create additional orders or reservations.

Orders of $2,000 or more receive the published free-delivery allowance. Other
orders await a delivery charge entered by Sales, Finance or Owner through the
order or Shipping detail screen. Payment cannot be recorded before this charge
is confirmed. Customers see the resulting total in My Account. Payments/refunds
remain manual records; there is no payment provider, automatic email or courier
integration. Shipping, payment and refund updates appear in the customer's order
history. Run `npm run check:customer` for isolated customer workflow regression
tests; no working inventory or customer data is used.
