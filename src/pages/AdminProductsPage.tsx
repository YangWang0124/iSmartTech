import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import { money } from "../lib/products";
import { useProducts } from "../context/ProductContext";

type AdminState = { authenticated: boolean; authorized: boolean; email?: string };
type Draft = Product & { featuresText: string; specificationsText: string; galleryImagesText: string; featureImagesText: string; colorsText: string };
const publishedStaffUrl = "https://iot-tech-store-demo.yangwang02885215668.chatgpt.site/staff/products";

const emptyDraft = (): Draft => ({
  id: "", name: "", brand: "", category: "CCTV Cameras", price: 0, sku: "", rating: 0, reviews: 0,
  stock: 0, badge: "", icon: "CAM", accent: "blue", shortDescription: "", description: "", features: [], specifications: {},
  featuresText: "", specificationsText: "Resolution: \nLens: \nWarranty: ", galleryImagesText: "", featureImagesText: "", colorsText: "White\nBlack", published: false,
});

function toDraft(product: Product): Draft {
  return { ...product, featuresText: product.features.join("\n"), specificationsText: Object.entries(product.specifications).map(([key, value]) => `${key}: ${value}`).join("\n"), galleryImagesText: (product.galleryImages || []).join("\n"), featureImagesText: (product.featureImages || []).join("\n"), colorsText: (product.colors || ["White", "Black"]).join("\n") };
}

export function AdminProductsPage() {
  const { products, refresh } = useProducts();
  const localPreview = (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") && new URLSearchParams(window.location.search).has("preview");
  const [session, setSession] = useState<AdminState | null>(null);
  const [items, setItems] = useState<Product[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [image, setImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [loadError, setLoadError] = useState("");
  const editing = Boolean(draft.id);

  const load = async () => {
    if (localPreview) {
      setSession({ authenticated: true, authorized: true, email: "preview@ismarttech.local" });
      setItems(products);
      return;
    }
    try {
      setLoadError("");
      const me = await fetch("/api/admin/me", { headers: { Accept: "application/json" } });
      const contentType = me.headers.get("content-type") || "";
      if (!me.ok || !contentType.includes("application/json")) throw new Error("Staff services are unavailable in this local preview.");
      const state = await me.json() as AdminState;
      setSession(state);
      if (state.authorized) {
        const response = await fetch("/api/admin/products");
        if (response.ok) setItems(await response.json());
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to open the product manager.");
    }
  };
  useEffect(() => { void load(); }, []);

  const set = (key: keyof Draft, value: string | number | boolean) => setDraft(current => ({ ...current, [key]: value }));
  const imagePreview = useMemo(() => image ? URL.createObjectURL(image) : draft.image, [image, draft.image]);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setNotice("");
    const features = draft.featuresText.split("\n").map(value => value.trim()).filter(Boolean);
    const galleryImages = draft.galleryImagesText.split("\n").map(value => value.trim()).filter(Boolean);
    const featureImages = draft.featureImagesText.split("\n").map(value => value.trim()).filter(Boolean);
    const colors = draft.colorsText.split("\n").map(value => value.trim()).filter(Boolean);
    const specifications = Object.fromEntries(draft.specificationsText.split("\n").map(line => line.split(":" as const)).filter(parts => parts.length > 1).map(([key, ...rest]) => [key.trim(), rest.join(":").trim()]));
    const payload = { ...draft, id: draft.id || draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), features, galleryImages, featureImages, colors, specifications };
    const body = new FormData(); body.set("product", JSON.stringify(payload)); if (image) body.set("image", image);
    const response = await fetch(editing ? `/api/admin/products/${encodeURIComponent(draft.id)}` : "/api/admin/products", { method: editing ? "PUT" : "POST", body });
    if (response.ok) { setNotice(editing ? "Product updated." : "Product created."); setDraft(emptyDraft()); setImage(null); await load(); await refresh(); }
    else setNotice((await response.json().catch(() => ({ error: "Unable to save product." }))).error);
    setBusy(false);
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/products/${encodeURIComponent(product.id)}`, { method: "DELETE" });
    if (response.ok) { await load(); await refresh(); if (draft.id === product.id) setDraft(emptyDraft()); }
  };

  if (loadError) return <main className="page container admin-gate"><span className="eyebrow">LOCAL PREVIEW</span><h1>Staff sign-in opens on the published website</h1><p>{loadError} Authentication and product storage run on the hosted version of the store.</p><a className="button button--primary" href={publishedStaffUrl}>Open staff sign-in</a></main>;
  if (!session) return <main className="page container admin-loading"><h1>Opening product manager…</h1></main>;
  if (!session.authenticated) return <main className="page container admin-gate"><span className="eyebrow">STAFF AREA</span><h1>Product management</h1><p>Sign in with your authorised ChatGPT account to manage the catalogue.</p><a className="button button--primary" href="/signin-with-chatgpt?return_to=/staff/products">Sign in with ChatGPT</a></main>;
  if (!session.authorized) return <main className="page container admin-gate"><span className="eyebrow">ACCESS RESTRICTED</span><h1>This account is not authorised</h1><p>Signed in as {session.email}. Ask the site owner to add this address to the staff allowlist.</p><a className="button button--ghost" href="/signout-with-chatgpt?return_to=/staff/products">Use another account</a></main>;

  return <main className="page container admin-page">
    <div className="admin-heading"><div><span className="eyebrow">STAFF CATALOGUE</span><h1>Product management</h1><p>Create products, upload images, update prices and stock, then publish when ready.</p></div><div><span>{session.email}</span><a href="/signout-with-chatgpt?return_to=/">Sign out</a></div></div>
    <div className="admin-layout">
      <section className="admin-list"><div className="admin-section-head"><h2>Products</h2><button className="button button--small" onClick={() => { setDraft(emptyDraft()); setImage(null); }}>＋ New product</button></div>
        {items.map(product => <article className="admin-product" key={product.id}>{product.image ? <img src={product.image} alt="" /> : <div>{product.icon}</div>}<span><strong>{product.name}</strong><small>{product.sku} · {money(product.price)} · {product.stock} in stock</small></span><b className={product.published ? "status-live" : "status-draft"}>{product.published ? "Published" : "Draft"}</b><button onClick={() => { setDraft(toDraft(product)); setImage(null); }}>Edit</button><button className="danger-link" onClick={() => void remove(product)}>Delete</button></article>)}
      </section>
      <form className="admin-form" onSubmit={submit}><div className="admin-section-head"><h2>{editing ? "Edit product" : "Add product"}</h2>{editing && <Link to={`/products/${draft.id}`} target="_blank">View product ↗</Link>}</div>
        <h3 className="admin-form__section">Product details</h3><div className="admin-fields"><label className="wide">Title<input required value={draft.name} onChange={e => set("name", e.target.value)} /></label><label>SKU<input required value={draft.sku} onChange={e => set("sku", e.target.value)} /></label><label>Brand<input required value={draft.brand} onChange={e => set("brand", e.target.value)} /></label><label>Category<input required value={draft.category} onChange={e => set("category", e.target.value)} /></label><label>Product badge<input value={draft.badge || ""} onChange={e => set("badge", e.target.value)} /></label><label>Price (NZD)<input required min="0" step="0.01" type="number" value={draft.price} onChange={e => set("price", Number(e.target.value))} /></label><label>Previous price<input min="0" step="0.01" type="number" value={draft.oldPrice || ""} onChange={e => set("oldPrice", Number(e.target.value) || 0)} /></label></div>
        <h3 className="admin-form__section">Product preview</h3><label className="image-upload"><span>{imagePreview ? <img src={imagePreview} alt="Preview" /> : "Upload main product image"}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => setImage(event.target.files?.[0] || null)} /><small>Main image: PNG, JPG or WebP, maximum 8 MB.</small></label><div className="admin-fields"><label className="wide">Additional gallery images <small>One image URL per line</small><textarea rows={3} value={draft.galleryImagesText} onChange={e => set("galleryImagesText", e.target.value)} /></label></div>
        <h3 className="admin-form__section">Description</h3><div className="admin-fields"><label className="wide">Description title<textarea required rows={2} value={draft.shortDescription} onChange={e => set("shortDescription", e.target.value)} /></label><label className="wide">Description<textarea required rows={4} value={draft.description} onChange={e => set("description", e.target.value)} /></label></div>
        <h3 className="admin-form__section">Features and options</h3><div className="admin-fields"><label className="wide">Feature labels <small>One per line</small><textarea rows={5} value={draft.featuresText} onChange={e => set("featuresText", e.target.value)} /></label><label className="wide">Feature badge images <small>One image URL per line, matching the labels</small><textarea rows={4} value={draft.featureImagesText} onChange={e => set("featureImagesText", e.target.value)} /></label><label className="wide">Colour choices <small>One colour per line</small><textarea rows={3} value={draft.colorsText} onChange={e => set("colorsText", e.target.value)} /></label><label className="wide">Specifications <small>Use “Name: Value”, one per line</small><textarea rows={6} value={draft.specificationsText} onChange={e => set("specificationsText", e.target.value)} /></label><label>Stock quantity<input required min="0" type="number" value={draft.stock} onChange={e => set("stock", Number(e.target.value))} /></label></div>
        <label className="publish-toggle"><input type="checkbox" checked={Boolean(draft.published)} onChange={e => set("published", e.target.checked)} /><span><strong>Publish product</strong><small>Published products appear immediately in the storefront.</small></span></label>
        {notice && <p className="admin-notice">{notice}</p>}<button className="button button--primary" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Create product"}</button>
      </form>
    </div>
  </main>;
}
