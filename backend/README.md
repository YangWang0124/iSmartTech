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

The storefront now connects registration, customer sign-in, account details, assigned-tier prices, checkout, order/tracking history and return requests to these records. No card charge, bank transfer or courier booking is sent automatically. Account-security emails use the local outbox by default.

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

All new orders await a positive delivery charge entered by Sales, Finance or Owner through the
order or Shipping detail screen. Payment cannot be recorded before this charge
is confirmed. Customers see the resulting total in My Account. Payments/refunds
remain manual records; there is no payment provider or courier integration. Order-update notifications now use the email queue described below. Shipping, payment and refund updates appear in the customer's order
history. Run `npm run check:customer` for isolated customer workflow regression
tests; no working inventory or customer data is used.


### Customer passwords and email verification

Customers change passwords in **My Account → Account security**, using their current
password. **Forgot password?** on Sign in requests a single-use reset link (30 minutes).
Registration queues a verification link (24 hours); My Account supports resending it.
The customer must verify the current email address before checkout. Existing accounts
also need verification; sign-in, profile and order history remain available.

Passwords require 12–256 characters. Changing/resetting a password invalidates older
customer sessions and unused reset links. An authenticated change keeps only the current
session signed in. Resetting requires a fresh sign-in. Old cookies issued before this
upgrade require sign-in again. Links are bound to their purpose and current account
email; suspended accounts cannot use them. Recovery requests use a generic response
and are rate limited. Tokens are stored as SHA-256 hashes; queued email bodies are
encrypted using ASP.NET Data Protection. Keep its keys persistent and private.

Local default: `ISMARTTECH_EMAIL_MODE=pickup`. **Owner → Access → Local email outbox**
shows test emails and their links when accessed locally. The worker also writes `.eml`
files to `email-outbox` beside the database (normally `outputs/email-outbox`), with a
private directory on macOS/Linux. “sent” in pickup mode means saved locally, not sent
to the recipient. No email subscription, external service or real delivery is used.
The preview API is Owner-only, loopback-only, and unavailable in public-admin mode.
Treat these messages as sensitive because they contain usable account links.

For later real delivery, configure these environment variables outside source control:

- `ISMARTTECH_SITE_URL`: canonical public HTTPS origin, for example `https://shop.example.com`
- `ISMARTTECH_EMAIL_MODE=smtp`
- `ISMARTTECH_EMAIL_FROM`: authorized sender address
- `ISMARTTECH_SMTP_HOST`, `ISMARTTECH_SMTP_PORT` (default `587`, STARTTLS required)
- `ISMARTTECH_SMTP_USERNAME`, `ISMARTTECH_SMTP_PASSWORD` if required by the server

Without SITE_URL, local links use the application's loopback listening address.
They never use a client-supplied Host header. The worker checks the durable queue
every five seconds and retries failed messages up to five times, at least a minute
apart. Real SMTP delivery, sender-domain configuration and public HTTPS must be
verified on deployment; they are not provided by the local test outbox.

Run `npm run check:customer-security` for isolated expiry, single-use, purpose/email
binding, reset/change/session revocation, checkout gating and local-delivery tests.
`npm run check:customer` checks existing commerce workflows including verification.
Both use disposable databases and force local pickup mode.


### Staff access management

Sign in as Owner and open **Access → Manage staff accounts**. This lists accounts,
roles and Active/Suspended status. Choose a role/status and Save; Add staff account
opens the existing creation form and role access guide. Sales, Warehouse and Finance
cannot read or change staff access. Existing staff retain their roles and start Active.
Suspension blocks new sign-ins and all existing sessions. Reactivation requires a fresh
sign-in; old cookies remain invalid. Role changes also invalidate sessions so staff
sign in again with the updated permissions. You cannot suspend yourself, remove your
own Owner access, or remove the final active Owner. Accounts are retained for audit
and order-history references. Concurrent edits are rejected; refresh before retrying.
Changes are recorded in the audit log without passwords or password hashes.

`npm run check:staff-access` tests role enforcement, suspension/reactivation, session
revocation, stale edits, self-lockout protection and auditing in a disposable database.

Owner can also use **Delete** beside a staff account. Confirmation is required.
Deletion removes sign-in credentials/access and the staff-list entry, invalidates
sessions, and is audited. Historic actor references remain for order/audit integrity;
the username is reserved and cannot be reused. Deleted accounts cannot be reactivated
through the status editor. Self-deletion and deleting the last active Owner are blocked.


### Contact enquiries

The public Contact form (English and Chinese) saves enquiries in SQLite. Required:
first name, last name, valid email, message. Phone and interest are optional. The
confirmation includes an enquiry reference. Failed requests show an error and retain
the form; retrying the same submission does not create another enquiry. Each IP is
limited to five submissions/attempts per ten minutes, with request size/field limits
and a same-origin custom-header requirement. Public users cannot read enquiries.

**Enquiries → Enquiry inbox** is available to Owner and Sales. Open an enquiry to
read the message/contact information, record internal notes and set New, In progress
or Closed. Filter the inbox by status; it shows the newest 500 matching messages.
Concurrent updates are rejected. Changes are audited by enquiry ID, without copying
message bodies or internal notes into the audit log. Messages are rendered as text.
No forwarding, automatic reply or outbound email is sent. Replies are handled separately.
Existing inventory/pricing/customer records are unchanged.

On a separately hosted frontend, the existing RETAIL_BACKEND_URL proxy now also
forwards `/api/retail/enquiries`. Public deployment still requires HTTPS. Run
`npm run check:enquiries` for isolated validation, persistence, retry, permissions,
workflow, concurrency, rate-limit and audit checks.

Installation quote requests now use the same inbox, marked **Installation request**.
Name, phone, email, full address and installation details are required; address and
details are retained in the enquiry detail screen. Contact enquiries retain their
existing fields. The responsive inbox shows NZ local received time and wraps long
contact details without hiding Open. Earlier preview-only installation submissions
were never stored and cannot be recovered; they must be submitted again.


### Simplified customer registration

The storefront signup form now asks for email and password (plus Remember me), without
name or invitation code. A new account uses its email as the initial internal display
name; a name can be added later in My Account. Existing customer records cannot be
claimed through public signup, including with legacy invitation codes; existing users
use sign-in/password recovery, while records with no login require staff assistance.
The older staff invitation API remains available for compatibility but public signup
no longer consumes those codes. Staff should assign company pricing after a customer
registers, rather than pre-creating a record that cannot sign in.

Price-tier labels are omitted from customer authentication/session/profile/order
responses and My Account. Assigned pricing remains server controlled; catalogue refresh
uses the profile version to pick up staff changes without exposing the tier name.


Checkout calculates and displays the server-priced order summary immediately on entry.
Preview does not require delivery fields; placement still validates address and phone,
permissions, email verification, live prices and stock. Customers fill delivery details
and select Place order without a separate Review step. Price changes require reviewing
the updated total before retrying. Successful placement clears both the active and
persisted browser cart; open tabs synchronize cart changes. Add-to-cart actions show
a dismissible notice. Delivery requiring a staff quote is labelled “Charge to be confirmed”.


### Order and shipping email templates

Order received, delivery charge confirmed, payment received, dispatched (courier,
tracking number and address), cancelled and reservation expired messages are now
queued automatically when their corresponding order updates succeed. They include
order numbers, product lines, GST-inclusive NZD amounts and the customer's next step.
Expiry dates use Pacific/Auckland time; the configured site origin links to My Account.
Owner can preview generated messages under **Access → Local email outbox**.

The existing local pickup default still sends no real emails and needs no paid service.
Messages appear within roughly five seconds while the app is running; reopening the
app processes pending events. In pickup mode “sent” means saved as a local email.
SMTP must be configured and tested before customers receive actual emails.

Optional bank-transfer instructions use `ISMARTTECH_BANK_ACCOUNT_NAME` and
`ISMARTTECH_BANK_ACCOUNT_NUMBER`, set outside source control. Payment references
are ORDER-{order number}. Until both settings exist, the template tells the customer
to wait for store payment instructions. Pending-delivery orders always tell customers
to wait for the final total; payment-received messages never ask them to pay again.
No bank feed, payment processing or courier booking is performed.

Events are saved in the same SQLite transaction as the order change, with snapshots
of order/contact/shipping information so subsequent edits cannot alter earlier emails.
They are processed in creation order and deduplicated; checkout/payment retries do not
produce duplicate notifications. Transaction rollback also rolls back the event. The
worker converts events into encrypted email queue entries atomically, then uses the
existing delivery retry policy. SMTP can still deliver duplicates if it accepts a
message and the process stops before recording success; this is not an exactly-once
external-delivery guarantee. Event snapshots contain customer/order information and
must be protected with the database; they contain no passwords or account-action tokens.
Existing order history is not backfilled. Templates are plain-text English messages.

`npm run check:notifications` exercises all six templates using disposable data and
local pickup only. `node scripts/check-customer-workflows.cjs --notifications --no-bank`
checks the unconfigured-bank fallback. Tests verify amounts, chronological order,
tracking, expiry/cancellation, snapshot accuracy, permissions and duplicate prevention.
