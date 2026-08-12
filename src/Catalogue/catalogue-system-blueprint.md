# Catalogue System Blueprint

This package converts the old project's category and filter information into a reusable specification for a new ecommerce prototype.

## Files

- `categories-full.json`: complete live category tree from `/Product/AllCategory` (7 roots, 86 total categories).
- `catalogue-config.json`: API endpoints, routes, product fields, search fields, sorting rules, filters, menu behaviour, and product display rules.

Keep the two files together. `catalogue-config.json` points to `categories-full.json` through `categoryDataFile`.

## How product classification works

Each product's `category` array contains numeric category IDs. Match those IDs against the `id` fields in `categories-full.json`. Do not match by visible title because titles may change or repeat (for example, several branches contain “Accessories” and “Kits”).

Example:

```json
{
  "id": 1001,
  "name": "Example IP Camera",
  "category": [2, 9, 14],
  "tag": [219, 247, 251, 232]
}
```

The category path is `CCTV > Camera > Wired IP Cameras`. Its tags mean `8 MP`, `Outdoor`, `Wired`, and `Bullet`.

## Where the configuration can be used

### Catalogue and breadcrumbs

Recursively traverse `sub_cat` to render catalogue pages. Store the ancestors of the current category to produce breadcrumbs.

### Navigation menu

The same category tree can produce a desktop mega-menu and a mobile accordion. Use `title` as the label and `/category/{links}` as the link.

### Product filtering

Always offer common filters such as brand, price, and availability. Select technical filters based on the current category using `categoryFilterAssignments`. A product matches a technical option when its numeric `tag` array contains the option ID.

### Product displays

Use the `productDisplay` field lists to keep grid cards compact, list rows descriptive, and product detail pages complete.

### Search and sorting

The configuration records the old frontend's useful search fields and sorting options. For a small prototype these can run in the browser. For a large catalogue, send the query, filters, sort, and page number to a backend search endpoint instead of downloading all products.

## Recommended component structure

```text
CatalogueProvider
├── CategoryMenu
├── Breadcrumbs
├── CataloguePage
│   ├── FilterPanel
│   ├── SortControl
│   └── ProductGrid / ProductList
└── ProductPage
```

`CatalogueProvider` should load categories, brands, and products once, normalize them by ID, and expose loading and error states.

## Important data issues to resolve

1. The old configuration reuses tag IDs `257`–`260` for both SATA bays and camera-kit counts. Confirm the real backend meaning before relying on these filters.
2. The live category endpoint supplies only `id`, `title`, `links`, and `sub_cat`. Category images, descriptions, SEO fields, display order, visibility, and product counts need to be added if the new prototype requires them.
3. The old local frontend is currently blocked by backend CORS. Production should configure allowed origins; local development can use a proxy.
4. Treat backend category IDs and product IDs as stable identifiers. Treat titles and slugs as editable presentation data.

## Suggested future category fields

```json
{
  "id": 14,
  "parentId": 9,
  "title": "Wired IP Cameras",
  "slug": "camera_wired-ip-cameras",
  "description": "",
  "image": "",
  "icon": "",
  "sortOrder": 0,
  "isVisible": true,
  "seoTitle": "",
  "seoDescription": "",
  "filterSet": "camera"
}
```

These additions would let one data source control the menu, catalogue landing pages, filtering, SEO, and product navigation without hard-coding category behaviour in React components.
