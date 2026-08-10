# IoT Tech Store Prototype

A responsive ecommerce display prototype for IoT Technologies. It is inspired by the clarity and catalogue depth of large New Zealand technology retailers without copying their design.

## What is included

- Home, product catalogue, product details, cart, about, and contact pages
- Search, category and brand filters, sorting, and responsive navigation
- 16 structured sample products in `src/data/products.json`
- A device-local cart saved with `localStorage`
- A safe demonstration checkout and contact form that do not transmit data

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Project structure

- `src/components` — reusable interface building blocks
- `src/pages` — route-level pages
- `src/context` — cart state and local persistence
- `src/data` — local product catalogue
- `src/lib` — shared catalogue utilities
- `src/styles.css` — responsive design system and page styles

This is a Phase 1 prototype: there is no backend, account system, live inventory, real checkout, or payment processing.
