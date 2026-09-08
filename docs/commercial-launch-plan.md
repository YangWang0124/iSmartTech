# iSmartTech Commercial Launch Plan

**Purpose:** Turn the current prototype into a dependable, revenue-generating commercial website.

**Recommended working format:** Keep this Markdown file as the editable source of truth. Use the companion PDF for meetings, approvals and sharing.

## 1. Current position

The storefront now has a substantial catalogue, consistent product cards and product pages, source-checked alarm content, foundational SEO, direct-route handling, a proper 404 page, and automated quality checks.

The site is still best treated as a commercial prototype until the customer journeys that create revenue - quotation, ordering, payment, inventory and fulfilment - are connected to real business systems.

## 2. Decide the commercial model first

**Owner: Boss / business lead**

Choose one primary launch model:

1. **Quotation-first (recommended for the first release):** Customers browse products, request a quote, and staff complete pricing, installation and payment manually. This is the fastest lower-risk route to revenue.
2. **Full ecommerce:** Customers see live prices and stock, pay online, receive order emails, and enter a fulfilment workflow. This needs considerably more backend, payment, tax and operational work.
3. **Hybrid:** Standard products can be purchased online; complex kits and installation jobs remain quotation-only.

Record these decisions before backend implementation:

- Products that can be bought online versus quoted
- Retail price, GST treatment and minimum margin
- Delivery areas, freight rules and pickup options
- Installation service areas and pricing method
- Returns, cancellations, warranties and supplier obligations
- Who owns catalogue, pricing, orders, refunds and customer enquiries

## 3. Launch priorities

### P0 - Required before taking real customer orders

| Work | Owner | Backend required? | Completion evidence |
|---|---|---:|---|
| Choose quotation-first, ecommerce or hybrid | Boss | No | Written decision and product rules |
| Connect quote and contact forms to a real inbox or CRM | Backend colleague | Yes | Test submission received and acknowledged |
| Define privacy, terms, returns, shipping and warranty policies | Boss + legal/business adviser | No backend | Approved pages are published |
| Confirm every displayed price, GST label and stock claim | Catalogue owner | Usually | Sample audit against the source system |
| Add production authentication only if customer accounts are needed | Backend colleague | Yes | Sign-in, sign-out and account access tested |
| Implement checkout, payment and order processing if ecommerce is selected | Backend colleague | Yes | Successful test payment, refund and order record |
| Add inventory and price synchronisation or a documented manual process | Backend colleague + catalogue owner | Usually | No overselling in an end-to-end test |
| Configure transactional email | Backend colleague | Yes | Quote/order confirmation and failure alerts received |
| Complete accessibility, mobile and cross-browser testing | Frontend owner | No | Test checklist passes |
| Configure analytics consent and conversion events | Frontend + business | Sometimes | Events verified without collecting unnecessary personal data |
| Establish backup, logging, error alerts and incident ownership | Backend colleague | Yes | Restore and alert tests completed |

### P1 - Required for a professional public launch

- Use the final domain and verify HTTPS, redirects, canonical URLs and email-domain records.
- Register Google Search Console and submit the sitemap.
- Configure Google Merchant Center only for products eligible for online purchase or free product listings.
- Complete structured-data checks for products, organisation and breadcrumbs.
- Optimise large JavaScript bundles and product images for Core Web Vitals.
- Test keyboard navigation, focus states, form labels, colour contrast and screen-reader names.
- Test current Chrome, Safari, Edge, iPhone and Android layouts.
- Add clear business identity, contact details, service area and trust information.
- Document who reviews supplier data and how often prices, stock and specifications are refreshed.
- Run a soft launch with staff before paid promotion.

## 4. Backend colleague handoff

Ask the backend colleague to confirm:

- Current platform, database and hosting responsibilities
- Source of truth for SKU, price, GST, stock and product status
- Quote form endpoint, spam protection, recipient and retention period
- Whether accounts are needed and what customer data will be stored
- Payment provider, webhook handling, refunds and reconciliation
- Cart and order persistence, order numbering and status model
- Delivery calculation, pickup, installation bookings and service areas
- Email provider and templates for quotes, orders, payment and fulfilment
- Admin roles, audit logs and protection of staff routes
- Rate limiting, input validation, secrets management and dependency updates
- Database backups, restore testing, logs, monitoring and incident alerts
- Development, staging and production environments
- API contract and test credentials for frontend integration

Do not send real customer data through placeholder forms while these items remain undecided.

## 5. Revenue plan

A practical first-stage funnel is:

**Search or marketplace listing -> relevant product/category page -> phone call or quote request -> staff qualification -> sale and installation**

Focus first on products with clear demand, reliable supply and healthy margin. Each important landing page should answer:

- What is the product or solution?
- Who is it for?
- What is included?
- Is installation available?
- What is the next action: buy, request a quote, call or email?
- Why should the customer trust iSmartTech?

Track gross profit, not only traffic or sales volume.

## 6. Promotion plan

### Owned channels

- Build useful category and product pages around real customer searches.
- Publish practical guides such as choosing camera resolution, wired versus wireless alarms, NVR storage sizing and Auckland installation planning.
- Keep Google Business Profile details, services, photos and reviews current.
- Ask completed customers for genuine reviews.
- Use email follow-up only with appropriate consent.

### Search and shopping

- Verify Search Console, submit the sitemap and monitor indexing errors.
- Use Merchant Center free listings for eligible purchasable products.
- Start paid Google Search campaigns only after calls, quote submissions and purchases are measured.
- Send each advertisement to the most relevant product or category page, not automatically to the homepage.

### Trade Me

A Trade Me account can be useful as an additional sales channel, especially for known products with clear prices and stock. It should not be the only acquisition strategy.

- Check current Trade Me seller and external-link rules before listing.
- Use consistent titles, SKUs, prices, stock, delivery terms and warranty details.
- Treat marketplace fees as part of product margin.
- Avoid using listings merely to divert buyers away from the marketplace.
- Track marketplace sales separately from direct website sales.
- Begin with a small set of reliable, competitive products and expand only after measuring margin and fulfilment effort.

### Local and partner growth

- Create landing pages for Auckland installation services and key service areas.
- Build referral relationships with electricians, builders, property managers and small-business IT providers.
- Use completed installations as case studies only with customer permission.
- Retargeting and social advertising should come after consent, analytics and a proven landing page are ready.

## 7. Measurement

Configure a simple dashboard with:

- Qualified quote requests
- Quote-to-sale conversion rate
- Online purchase conversion rate
- Phone and email enquiry clicks
- Revenue and gross margin by product/channel
- Customer acquisition cost
- Return on advertising spend
- Cart or quote-form abandonment
- Refund, cancellation and return rate
- Stock accuracy and order fulfilment time
- Organic landing pages, impressions and clicks
- Site errors and failed form/payment events

## 8. Suggested 30/60/90-day sequence

### Days 1-30: Make it operational

- Choose the commercial model.
- Complete the backend handoff.
- Connect quotation/contact processing.
- Approve commercial and privacy policies.
- Verify price, stock, GST and fulfilment rules.
- Finish accessibility, browser and mobile testing.
- Soft-launch to staff and a small customer group.

### Days 31-60: Make it discoverable

- Move to the final domain.
- Configure Search Console, analytics and conversion tracking.
- Submit the sitemap and resolve indexing issues.
- Improve priority category and product pages.
- Set up Google Business Profile and review collection.
- Trial a small set of Trade Me listings after policy and margin review.

### Days 61-90: Make it scalable

- Add ecommerce only where operations are ready.
- Launch measured search or shopping campaigns.
- Expand content and partner referrals.
- Review conversion, margin and fulfilment data every two weeks.
- Prioritise improvements based on profit and customer friction.

## 9. Go-live sign-off

The commercial launch is ready only when:

- [ ] The commercial model and owners are documented.
- [ ] Real quote/order submissions reach the responsible team.
- [ ] Pricing, GST, stock, freight and installation rules are verified.
- [ ] Privacy, terms, returns and warranty information is approved.
- [ ] Direct routes, 404 handling, sitemap and metadata checks pass.
- [ ] Accessibility, mobile and cross-browser checks pass.
- [ ] Payment and refund tests pass if ecommerce is enabled.
- [ ] Transactional emails and failure alerts are received.
- [ ] Backups, logs and incident ownership are confirmed.
- [ ] Analytics and conversions are verified.
- [ ] The final domain, Search Console and sitemap are configured.
- [ ] A staff soft launch has completed without critical issues.

## 10. Immediate next meeting

Schedule a 45-minute meeting with the boss, backend colleague and catalogue owner. Leave the meeting with:

1. The selected commercial model
2. Named owners for each P0 item
3. A backend integration scope
4. A target soft-launch date
5. A decision on the first products and channels to promote
