# Final-domain SEO launch checklist

The code is ready for a custom domain and Google Search Console. The following values cannot be completed until the business chooses the real domain and Google supplies a verification token.

## Before the production build

1. Set `SITE_URL` to the final HTTPS origin, for example `https://www.example.co.nz`.
2. Set the same `SITE_URL` in the hosted runtime so canonical links remain on the final domain even if the site is reached through a preview hostname.
3. Add the Search Console HTML-tag token as `GOOGLE_SITE_VERIFICATION` in the hosted runtime. Store only the token value, not the complete `<meta>` tag.
4. Build and deploy. Confirm `/robots.txt` and `/sitemap.xml` use the final domain.
5. In Search Console, verify the domain/property and submit `/sitemap.xml`.
6. Request indexing for the homepage and a representative category and product page.

## Domain change

- Keep the preferred `www` or non-`www` hostname consistent.
- Redirect every alternative hostname and HTTP request to the preferred HTTPS hostname at the hosting/DNS layer.
- Keep the existing renamed-product redirect in place.
- If any future product or category slug changes, add a permanent redirect from the old path and keep old aliases out of the sitemap.

## Merchant Center

Wait until product prices, availability, shipping, returns and purchasing are genuine. Merchant Center should not advertise prototype checkout or quote-only products as directly purchasable.
