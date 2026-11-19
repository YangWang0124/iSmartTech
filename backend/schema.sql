CREATE TABLE IF NOT EXISTS staff (
    username TEXT PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('owner','sales','warehouse','finance')),
    salt TEXT NOT NULL,
    password_hash TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
    sku TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    active INTEGER NOT NULL CHECK (active IN (0,1)),
    retail_cents INTEGER CHECK (retail_cents > 0),
    sale_cents INTEGER CHECK (sale_cents > 0 AND sale_cents <= retail_cents),
    cost_cents INTEGER CHECK (cost_cents > 0),
    kind TEXT NOT NULL DEFAULT 'other' CHECK (kind IN ('other','camera','recorder','storage')),
    channels INTEGER CHECK (channels > 0),
    CHECK (kind != 'recorder' OR channels IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS stock_movements (
    id INTEGER PRIMARY KEY,
    sku TEXT NOT NULL REFERENCES products(sku),
    on_hand_delta INTEGER NOT NULL,
    reserved_delta INTEGER NOT NULL DEFAULT 0,
    reason TEXT NOT NULL,
    actor TEXT NOT NULL REFERENCES staff(username),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE VIEW IF NOT EXISTS inventory AS
SELECT products.*, COALESCE(SUM(on_hand_delta),0) AS on_hand,
       COALESCE(SUM(reserved_delta),0) AS reserved,
       COALESCE(SUM(on_hand_delta - reserved_delta),0) AS available
FROM products LEFT JOIN stock_movements USING (sku) GROUP BY products.sku;
CREATE TABLE IF NOT EXISTS compatibility (
    recorder TEXT NOT NULL REFERENCES products(sku),
    component TEXT NOT NULL REFERENCES products(sku),
    PRIMARY KEY (recorder, component)
);
CREATE TABLE IF NOT EXISTS margin_rules (
    category TEXT PRIMARY KEY,
    basis_points INTEGER NOT NULL CHECK (basis_points BETWEEN 0 AND 9999)
);
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'quoted'
        CHECK (status IN ('quoted','reserved','paid','dispatched','cancelled')),
    expires_at TEXT NOT NULL,
    payment_ref TEXT UNIQUE,
    created_by TEXT NOT NULL REFERENCES staff(username)
);
CREATE TABLE IF NOT EXISTS order_lines (
    order_id INTEGER NOT NULL REFERENCES orders(id),
    sku TEXT NOT NULL REFERENCES products(sku),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_cents INTEGER NOT NULL CHECK (unit_cents > 0),
    PRIMARY KEY (order_id, sku)
);
CREATE TABLE IF NOT EXISTS dispatched_units (
    serial TEXT PRIMARY KEY,
    order_id INTEGER NOT NULL,
    sku TEXT NOT NULL,
    FOREIGN KEY (order_id, sku) REFERENCES order_lines(order_id, sku)
);
CREATE TABLE IF NOT EXISTS returns (
    id INTEGER PRIMARY KEY,
    order_id INTEGER NOT NULL,
    sku TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    serial TEXT UNIQUE REFERENCES dispatched_units(serial),
    sellable INTEGER NOT NULL CHECK (sellable IN (0,1)),
    refund_cents INTEGER NOT NULL CHECK (refund_cents >= 0),
    reason TEXT NOT NULL,
    FOREIGN KEY (order_id, sku) REFERENCES order_lines(order_id, sku)
);
CREATE TABLE IF NOT EXISTS audit (
    id INTEGER PRIMARY KEY,
    actor TEXT NOT NULL REFERENCES staff(username),
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_price_tiers (
    sku TEXT NOT NULL REFERENCES products(sku),
    tier TEXT NOT NULL,
    cents INTEGER NOT NULL CHECK (cents >= 0),
    PRIMARY KEY (sku, tier)
);
CREATE TABLE IF NOT EXISTS workbook_imports (
    fingerprint TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    actor TEXT NOT NULL REFERENCES staff(username),
    report TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS product_source_links (
    sku TEXT PRIMARY KEY REFERENCES products(sku),
    url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS retail_migrations (
    name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS storefront_content (
    sku TEXT PRIMARY KEY REFERENCES products(sku),
    route_id TEXT NOT NULL UNIQUE,
    payload TEXT NOT NULL CHECK (json_valid(payload)),
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS storefront_aliases (
    route_id TEXT PRIMARY KEY,
    sku TEXT NOT NULL REFERENCES products(sku)
);

CREATE TABLE IF NOT EXISTS product_images (
    id TEXT PRIMARY KEY,
    content_type TEXT NOT NULL,
    content BLOB NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
 id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE COLLATE NOCASE,
 company TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '',
 active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
 can_purchase INTEGER NOT NULL DEFAULT 1 CHECK(can_purchase IN (0,1)),
 price_tier TEXT NOT NULL DEFAULT 'S · Trade Price', version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS order_customers (
 order_id INTEGER PRIMARY KEY REFERENCES orders(id), customer_id INTEGER NOT NULL REFERENCES customers(id),
 customer_name TEXT NOT NULL, customer_email TEXT NOT NULL, price_tier TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS order_payments (
 order_id INTEGER PRIMARY KEY REFERENCES orders(id), amount_cents INTEGER NOT NULL CHECK(amount_cents>0),
 reference TEXT NOT NULL UNIQUE, method TEXT NOT NULL, actor TEXT NOT NULL REFERENCES staff(username),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS fulfilments (
 order_id INTEGER PRIMARY KEY REFERENCES orders(id), method TEXT NOT NULL CHECK(method IN ('delivery','collection')),
 status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','preparing','ready','dispatched','collected')),
 address TEXT NOT NULL DEFAULT '', carrier TEXT NOT NULL DEFAULT '', tracking TEXT NOT NULL DEFAULT '',
 collection_contact TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '',
 version INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS return_requests (
 id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL, sku TEXT NOT NULL, quantity INTEGER NOT NULL CHECK(quantity>0),
 reason TEXT NOT NULL, serial TEXT, status TEXT NOT NULL DEFAULT 'requested'
 CHECK(status IN ('requested','approved','rejected','received')),
 return_id INTEGER UNIQUE REFERENCES returns(id), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(order_id,sku) REFERENCES order_lines(order_id,sku)
);
CREATE TABLE IF NOT EXISTS refund_records (
 request_id INTEGER PRIMARY KEY REFERENCES return_requests(id), amount_cents INTEGER NOT NULL CHECK(amount_cents>0),
 reference TEXT NOT NULL UNIQUE, actor TEXT NOT NULL REFERENCES staff(username),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_credentials (
 customer_id INTEGER PRIMARY KEY REFERENCES customers(id), salt TEXT NOT NULL, password_hash TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS customer_invitations (
 customer_id INTEGER PRIMARY KEY REFERENCES customers(id), token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS storefront_service (
 id INTEGER PRIMARY KEY CHECK(id=1), username TEXT NOT NULL UNIQUE REFERENCES staff(username)
);
CREATE TABLE IF NOT EXISTS order_charges (
 order_id INTEGER PRIMARY KEY REFERENCES orders(id), shipping_cents INTEGER CHECK(shipping_cents>=0),
 installation_cents INTEGER NOT NULL DEFAULT 0 CHECK(installation_cents>=0), installation_details TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS customer_checkouts (
 customer_id INTEGER NOT NULL REFERENCES customers(id), request_key TEXT NOT NULL, fingerprint TEXT NOT NULL,
 order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id), PRIMARY KEY(customer_id,request_key)
);
