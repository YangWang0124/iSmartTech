CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL DEFAULT 0,
  old_price REAL,
  sku TEXT NOT NULL UNIQUE,
  rating REAL NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  badge TEXT,
  icon TEXT NOT NULL DEFAULT 'CAM',
  accent TEXT NOT NULL DEFAULT 'blue',
  image_key TEXT,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT NOT NULL DEFAULT '[]',
  specifications TEXT NOT NULL DEFAULT '{}',
  published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_published_category ON products(published, category);

CREATE TABLE IF NOT EXISTS catalogue_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

PRAGMA optimize;
