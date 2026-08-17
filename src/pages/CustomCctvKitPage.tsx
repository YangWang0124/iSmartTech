import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router-dom";
import { ProductVisual } from "../components/ProductVisual";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { technicalFilters } from "../lib/catalogue";
import { money } from "../lib/products";
import type { Product } from "../types";

const cameraCategoryIds = [13, 14, 15, 16, 17];
const recorderCategoryIds = [18, 19];
const hardDriveIds = new Set(["source-564", "source-567", "source-568", "source-720", "source-896"]);
const supportedBrands = ["Dahua", "Uniarch", "Hikvision", "Uniview"];
const bitrates: Record<number, [number, number]> = { 216: [5, 2.5], 217: [7, 3.5], 245: [9, 4.5], 218: [11, 5.5], 219: [13, 7] };
const driveTb: Record<string, number> = { "source-564": 1, "source-720": 2, "source-896": 4, "source-567": 6, "source-568": 8 };
const channels: Record<number, number> = { 225: 4, 226: 8, 227: 16, 261: 24, 228: 32, 229: 64 };
const sata: Record<number, number> = { 257: 1, 258: 2, 259: 4, 260: 8 };
const norm = (value: string) => value.trim().toLowerCase();
const compatible = (product: Product, brand: string) => norm(product.brand) === norm(brand) || (["uniview", "uniarch"].includes(norm(product.brand)) && ["uniview", "uniarch"].includes(norm(brand)));
const drive = (product: Product) => hardDriveIds.has(product.id) || /hard\s*drive|hdd|skyhawk|wd purple/i.test(`${product.name} ${product.category}`);
const capacity = (count: number) => count <= 4 ? 4 : count <= 8 ? 8 : count <= 16 ? 16 : count <= 24 ? 24 : count <= 32 ? 32 : 64;
const tagValue = (product: Product, values: Record<number, unknown>) => Object.keys(values).map(Number).find(tag => product.tagIds?.includes(tag));
const matchesSelectedFilters = (product: Product, selectedTags: number[]) => technicalFilters.every(filter => {
  const selectedInGroup = filter.options.map(([id]) => id).filter(id => selectedTags.includes(id));
  return !selectedInGroup.length || selectedInGroup.some(tag => product.tagIds?.includes(tag));
});

export function CustomCctvKitPage() {
  const { products, loading } = useProducts();
  const { addCustomKit } = useCart();
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState("");
  const [cameraQty, setCameraQty] = useState<Record<string, number>>({});
  const [recorderId, setRecorderId] = useState("");
  const [driveQty, setDriveQty] = useState<Record<string, number>>({});
  const [accessoryQty, setAccessoryQty] = useState<Record<string, number>>({});
  const [filters, setFilters] = useState<number[]>([]);
  const [storeys, setStoreys] = useState(1);
  const [noRoofAccess, setNoRoofAccess] = useState<boolean | null>(null);
  const [installation, setInstallation] = useState(false);
  const [added, setAdded] = useState(false);
  useEffect(() => {
    document.querySelectorAll<HTMLSelectElement>(".kit-filters select").forEach((select, index) => {
      if (!Array.from(select.options).some(option => option.value === "__clear_filter")) {
        const clearOption = new Option("Clear", "__clear_filter");
        select.add(clearOption, 0);
      }
      const selectedLabels = technicalFilters[index].options
        .filter(([id]) => filters.includes(id))
        .map(([, label]) => label);
      select.value = "";
      const displayOption = Array.from(select.options).find(option => option.value === "");
      if (displayOption) displayOption.text = selectedLabels.length ? selectedLabels.join(", ") : "Add filter";
    });
  }, [filters, step]);
  useEffect(() => {
    const bindings = Array.from(document.querySelectorAll<HTMLSelectElement>(".kit-filters select")).map((select, index) => {
      const clearFilter = (event: Event) => {
        if ((event.currentTarget as HTMLSelectElement).value !== "__clear_filter") return;
        event.stopPropagation();
        const tagIds = new Set<number>(technicalFilters[index].options.map(([id]) => id));
        setFilters(current => current.filter(tag => !tagIds.has(tag)));
      };
      select.addEventListener("change", clearFilter, true);
      return () => select.removeEventListener("change", clearFilter, true);
    });
    return () => bindings.forEach(remove => remove());
  }, [step]);
  const cameras = useMemo(() => products.filter(p => cameraCategoryIds.some(id => p.categoryIds?.includes(id)) && p.stock > 0 && (!brand || compatible(p, brand)) && matchesSelectedFilters(p, filters)), [products, brand, filters]);
  const selectedCameras = cameras.map(product => ({ product, quantity: cameraQty[product.id] || 0 })).filter(item => item.quantity > 0);
  const cameraCount = selectedCameras.reduce((total, item) => total + item.quantity, 0);
  const recorders = useMemo(() => products.filter(p => recorderCategoryIds.some(id => p.categoryIds?.includes(id)) && p.stock > 0 && !!brand && compatible(p, brand) && (channels[tagValue(p, channels) || 0] || 0) >= capacity(cameraCount)), [products, brand, cameraCount]);
  const recorder = recorders.find(p => p.id === recorderId);
  const maxDrives = recorder ? sata[tagValue(recorder, sata) || 0] || 0 : 0;
  const drives = useMemo(() => products.filter(p => p.stock > 0 && drive(p)), [products]);
  const selectedDrives = drives.map(product => ({ product, quantity: driveQty[product.id] || 0 })).filter(item => item.quantity > 0);
  const driveCount = selectedDrives.reduce((total, item) => total + item.quantity, 0);
  const accessories = useMemo(() => products.filter(p => p.categoryIds?.includes(12) && p.stock > 0 && !!brand && compatible(p, brand)), [products, brand]);
  const selectedAccessories = accessories.map(product => ({ product, quantity: accessoryQty[product.id] || 0 })).filter(item => item.quantity > 0);
  const kitLines = [...selectedCameras, ...(recorder ? [{ product: recorder, quantity: 1 }] : []), ...selectedDrives, ...selectedAccessories];
  const installationCost = installation && noRoofAccess !== null ? 60 + storeys * 30 + (noRoofAccess ? 30 : 0) : 0;
  const regularTotal = kitLines.reduce((total, item) => total + item.product.price * item.quantity, installationCost);
  const kitPrice = kitLines.reduce((total, item) => total + (drive(item.product) || selectedAccessories.some(a => a.product.id === item.product.id) || item.product.oldPrice ? item.product.price : item.product.price * .9) * item.quantity, installationCost);
  const storage = selectedDrives.reduce((total, item) => total + (driveTb[item.product.id] || Number((item.product.name.match(/(\d+)\s*TB/i) || [])[1]) || 0) * item.quantity, 0);
  const recordingDays = (format: 0 | 1) => { const bitrate = selectedCameras.reduce((total, item) => { const resolution = tagValue(item.product, bitrates); return total + (resolution ? bitrates[resolution][format] : 0) * item.quantity; }, 0); return storage && bitrate ? storage * 1024 * 1024 * 8 / bitrate / 3600 / 24 : 0; };
  const advanceAllowed = step === 0 ? !!brand : step === 1 ? cameraCount > 0 : step === 2 ? !!recorder : step === 3 ? selectedDrives.length > 0 : true;
  const adjust = (setter: Dispatch<SetStateAction<Record<string, number>>>, id: string, quantity: number, maximum = 99) => setter(current => ({ ...current, [id]: Math.max(0, Math.min(maximum, quantity)) }));
  const resetForBrand = (next: string) => { setBrand(next); setCameraQty({}); setRecorderId(""); setDriveQty({}); setAccessoryQty({}); };
  const submit = () => {
    if (!recorder || !selectedCameras.length || !selectedDrives.length || noRoofAccess === null) return;
    const customKitId = crypto.randomUUID();
    addCustomKit(kitLines.map((line, index) => ({ productId: line.product.id, quantity: line.quantity, customKitId, unitPrice: Number((drive(line.product) || selectedAccessories.some(item => item.product.id === line.product.id) || line.product.oldPrice ? line.product.price : line.product.price * .9).toFixed(2)), installationCost: index === 0 ? installationCost : undefined, installation: index === 0 ? { storeys, noRoofAccess } : undefined })));
    setAdded(true); window.setTimeout(() => setAdded(false), 2200);
  };
  const steps = ["Brand", "Camera", "NVR", "Hard Drive", "Accessory", "Installation"];
  return <main className="page container kit-builder"><div className="breadcrumb"><Link to="/">Home</Link><span>›</span><Link to="/products">Products</Link><span>›</span>Custom CCTV Kit</div><header className="kit-builder__heading"><span className="eyebrow">CUSTOMISE YOUR SECURITY</span><h1>Build your own CCTV kit</h1><p>Choose compatible cameras, recorder, storage and accessories. The kit is checked as you build.</p></header><div className="kit-steps">{steps.map((name, index) => <button key={name} className={index === step ? "active" : ""} disabled={index > step} onClick={() => setStep(index)}><span>{index + 1}</span>{name}</button>)}</div>{loading ? <section className="kit-panel">Loading current catalogue…</section> : <section className="kit-panel">{step === 0 && <><h2>Choose a brand</h2><p className="kit-note">Cameras and NVRs of different brands cannot be mixed. Uniview and Uniarch can be mixed.</p><div className="kit-brand-grid">{supportedBrands.map(name => <button key={name} className={brand === name ? "selected" : ""} onClick={() => resetForBrand(name)}>{name}</button>)}</div></>}{step === 1 && <><h2>Select cameras <small>{cameraCount} selected</small></h2><div className="kit-filters">{technicalFilters.map(filter => <label key={filter.key}>{filter.label}<select defaultValue="" onChange={event => { const tag = Number(event.target.value); if (tag) setFilters(current => current.includes(tag) ? current.filter(value => value !== tag) : [...current, tag]); event.currentTarget.value = ""; }}><option value="">Add filter</option>{filter.options.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>)}{filters.length ? <button className="text-button" onClick={() => setFilters([])}>Clear filters</button> : null}</div><Rows products={cameras} quantities={cameraQty} onQuantity={(id, qty) => adjust(setCameraQty, id, qty)} /></>}{step === 2 && <><h2>Choose an NVR <small>{capacity(cameraCount)}+ channels required</small></h2><Rows products={recorders} quantities={recorderId ? { [recorderId]: 1 } : {}} selectOne onSelect={setRecorderId} /></>}{step === 3 && <><h2>Select hard drives <small>up to {maxDrives} drive{maxDrives === 1 ? "" : "s"}</small></h2>{storage ? <p className="kit-recording">Estimated recording: <b>H.264 {recordingDays(0).toFixed(1)} days</b> · <b>H.265 {recordingDays(1).toFixed(1)} days</b></p> : <p className="kit-note">Select storage to calculate estimated recording time.</p>}<Rows products={drives} quantities={driveQty} onQuantity={(id, qty) => adjust(setDriveQty, id, qty, Math.max(0, maxDrives - driveCount + (driveQty[id] || 0)))} /></>}{step === 4 && <><h2>Add accessories <small>optional</small></h2><Rows products={accessories} quantities={accessoryQty} onQuantity={(id, qty) => adjust(setAccessoryQty, id, qty)} /></>}{step === 5 && <><h2>Installation <small>optional</small></h2><div className="kit-installation"><label>How many storeys?<input type="number" min="1" value={storeys} onChange={event => setStoreys(Math.max(1, Number(event.target.value)))} /></label><p>Split-level homes with only a garage below are classed as double-storey.</p><div><button className={noRoofAccess === true ? "selected" : ""} onClick={() => setNoRoofAccess(true)}>Roof is flat or no cavity</button><button className={noRoofAccess === false ? "selected" : ""} onClick={() => setNoRoofAccess(false)}>Roof is not flat or has cavity</button></div>{noRoofAccess !== null && <><p className="kit-note">No roof or wall cavity requires conduit and additional installation time.</p><label className="kit-checkbox"><input type="checkbox" checked={installation} onChange={event => setInstallation(event.target.checked)} /> Add installation — {money(60 + storeys * 30 + (noRoofAccess ? 30 : 0))}</label></>}</div></>}<footer className="kit-panel__footer"><div>{cameraCount > 0 && <><span>Regular total <del>{money(regularTotal)}</del></span><strong>Kit price {money(kitPrice)}</strong><small>10% off eligible cameras and NVRs. Existing sale items, drives and accessories are excluded.</small></>}</div>{step < 5 ? <button className="button button--primary" disabled={!advanceAllowed} onClick={() => setStep(current => current + 1)}>Next step →</button> : <button className="button button--primary" disabled={!recorder || !selectedCameras.length || !selectedDrives.length || noRoofAccess === null} onClick={submit}>{added ? "✓ Custom kit added" : "Add custom kit to cart"}</button>}</footer></section>}</main>;
}

function Rows({ products, quantities, onQuantity, selectOne, onSelect }: { products: Product[]; quantities: Record<string, number>; onQuantity?: (id: string, quantity: number) => void; selectOne?: boolean; onSelect?: (id: string) => void }) {
  if (!products.length) return <div className="kit-empty"><h3>No compatible products found</h3><p>Try a different selection.</p></div>;
  return <div className="kit-product-list">{products.slice(0, 30).map(product => <article className={quantities[product.id] ? "selected" : ""} key={product.id}><ProductVisual icon={product.icon} accent={product.accent} image={product.image} alt={product.name} /><div><span className="eyebrow">{product.brand} · {product.sku}</span><h3>{product.name}</h3><strong>{money(product.price)}</strong><small>{product.stock} in stock</small></div>{selectOne ? <button className="button button--secondary" onClick={() => onSelect?.(product.id)}>{quantities[product.id] ? "Selected" : "Choose"}</button> : <div className="kit-quantity"><button onClick={() => onQuantity?.(product.id, (quantities[product.id] || 0) - 1)}>−</button><b>{quantities[product.id] || 0}</b><button onClick={() => onQuantity?.(product.id, (quantities[product.id] || 0) + 1)}>+</button></div>}</article>)}</div>;
}
