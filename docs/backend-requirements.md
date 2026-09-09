# iSmartTech Backend Handoff

**Goal:** Connect the finished storefront to real business services.  
**Recommended first launch:** Quote-first. Customers browse products and send real enquiries or quote requests. Online payment can be added later.

## Page 1 - APIs the website needs

### 1. Product and catalogue API

The website already has a basic product API and staff product editor using the hosted database and image storage. The backend colleague should confirm whether this remains the production source or connects to another catalogue.

**Needed:**

- `GET /api/products` - published products only.
- `GET /api/products/:id` - one product by stable ID or slug.
- Staff create, edit, publish and retire product endpoints.
- Product image upload and delivery.
- Clear values for exact price, price on request, in stock, stock on request and unavailable.

**The business must provide:**

- The official source for product names, SKUs, prices and stock.
- API details or export format if this data comes from another system.
- How often prices and stock should update.
- Who is allowed to approve and publish changes.

### 2. Contact and quote APIs

The current forms are demonstrations and do not send anything. These are the most important APIs for a quote-first launch.

- `POST /api/contact` - general enquiry.
- `POST /api/product-quote` - customer details, product ID/SKU, quantity and message.
- `POST /api/installation-quote` - customer details, address, products and installation notes.

Each API should:

- Check required fields on the server.
- Block obvious spam and limit repeated submissions.
- Save the request or reliably place it in an email/CRM queue.
- Send it to the correct staff mailbox or CRM.
- Email the customer a confirmation and reference number.
- Log delivery failures so the team knows when a request was not received.

### 3. Staff access API

The hosted prototype currently recognizes the hosting platform's signed-in user and checks the email against an allowlist. The backend colleague needs to confirm whether this will be the real staff login.

- `GET /api/admin/me` - return signed-in staff member and role.
- Protect every admin create/edit/delete request on the server.
- Support at least `catalogue editor` and `administrator` roles.
- Record who changed products, prices, stock or publication status.
- Provide a quick way to remove access when a staff member leaves.

### 4. Later, only if online checkout is approved

Do not build these for the quote-first launch unless the business decides to sell and take payment online:

- Cart validation and server-side price calculation.
- Checkout, delivery and customer address APIs.
- Payment provider checkout and webhook handling.
- Orders, stock reservation, refunds and customer order emails.
- Real customer accounts, password reset and order history.

---

## Page 2 - Accounts, access and information to collect

### Ask the backend colleague or account owner for

| Item | What is needed |
| --- | --- |
| Hosting account | Access to the production site/project, deployment settings and the person who owns billing. The current project uses a Worker-style host, a D1 database and R2 image storage. |
| Domain and DNS | Access to the final domain, DNS records and SSL/domain verification. |
| Database and image storage | Production database/bucket names, environment separation, backup method and restore owner. |
| Product source | Name of the source system, API URL, credentials or export, field mapping, update frequency and failure fallback. |
| Staff login | Chosen identity provider, authorized staff emails, roles and the person who approves/removes access. |
| Business email | Approved sender address, shared inbox for enquiries and access to DNS records for email authentication. |
| Email service | Transactional email provider account/API key, verified sending domain and delivery-failure alerts. |
| CRM/helpdesk | Account and API access if enquiries should also create CRM leads or support tickets. Optional for launch. |
| Spam protection | Selected CAPTCHA/bot-protection account or hosting-native equivalent, plus allowed domains. |
| Monitoring | Error/logging account, alert recipients and who responds to failed forms or catalogue updates. |
| Privacy settings | Approved privacy notice, consent wording and how long enquiries should be kept. |

### Business answers needed before connecting anything

1. Where should contact, product quote and installation quote requests go?
2. Who replies, and what response time should the confirmation promise?
3. Which system is correct when website price/stock conflicts with another source?
4. Should unknown price or stock automatically become `Price on request` / `Stock on request`?
5. Which staff can edit products, and which can publish them?
6. What service areas, delivery choices and installation areas can be advertised?
7. Is the first launch quote-only, or must customers pay online immediately?

### Minimum launch test

Before launch, submit one real contact form, one product quote and one installation quote. Confirm each request:

- appears in the correct inbox or CRM;
- has the correct product/customer details;
- sends the customer confirmation;
- can be traced using its reference number; and
- creates an alert if delivery is deliberately made to fail.

Also confirm that an unauthorized user cannot open or change the staff catalogue, that a price/stock update reaches the public product page, and that database backups can be restored.

### Simple delivery order

1. Confirm hosting, domain, product source, staff login and email ownership.
2. Connect the three form APIs and test real delivery.
3. Confirm the catalogue API and staff permissions.
4. Add monitoring, backups, privacy text and a short operating guide.
5. Launch quote-first.
6. Decide later whether ecommerce is worth the additional payment, order, stock and fulfilment work.
