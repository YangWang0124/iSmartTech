import { readFile, writeFile } from 'node:fs/promises';
import { transform } from 'esbuild';
import { fetchCatalogue } from '../worker/catalogue-source.js';
import bundled from '../src/data/products.json';
import { createCuratedProducts } from '../src/data/curatedProducts.ts';
import { alarmProducts, createAlarmDetailContent, alarmKitComponentIds, alarmKitComponentDisplayName,
  arrowheadKitSupplementalItems, paradoxKitSupplementalItems, arrowheadKitIncludedItems } from '../src/data/alarmProducts.ts';
import { catalogueCategories, withCatalogueCategory } from '../src/lib/catalogue.ts';
import { featuredProductIds } from '../src/data/featuredProducts.ts';
import { localizeProduct } from '../src/lib/product-i18n.ts';

// Run once when migrating the existing storefront. The C# database owns edits afterwards.
const files = {
  '/Product/All': 'products', '/Product/AllBrand': 'brands', '/Product/AllCategory': 'categories'
};
const source = await fetchCatalogue(async url => ({
  ok: true, json: async () => JSON.parse(await readFile('work/catalogue-import/' + files[new URL(url).pathname] + '.json', 'utf8'))
}));
const page = await readFile('src/pages/ProductDetailPage.tsx', 'utf8');
const constants = page.slice(page.indexOf('type DetailedTiandyContent'), page.indexOf('export function ProductDetailPage'));
const names = ['dahuaDetailedContent', 'accessoryDetailedContent', 'tiandyC36Content', 'tiandyH333Content',
  'tiandyAdditionalDetailedContent', 'tiandyAdditionalCameraContent', 'pdfDetailedProductContent', 'nvrDetailedProductContent'];
const compiled = await transform(constants + '\nexport {' + names.join(',') + '};', { loader: 'ts' });
const details = await import('data:text/javascript;base64,' + Buffer.from(compiled.code).toString('base64'));
const curated = createCuratedProducts(source);
const clean = value => value.replace(/^(?:\s*[(（]\s*inactive\s*[)）]\s*)+/i, '').trim();
const normalise = value => clean(value).toLowerCase();
const records = new Map();
const routeOwners = new Map();
for (const product of [...curated, ...alarmProducts, ...bundled, ...source]) {
  const key = normalise(product.sku);
  if (routeOwners.has(product.id) && routeOwners.get(product.id) !== key) continue;
  routeOwners.set(product.id, key);
  const previous = records.get(key);
  if (previous) {
    previous.routeAliases = [...new Set([...previous.routeAliases, product.id])].filter(id => id !== previous.id);
    continue;
  }
  const live = source.find(item => normalise(item.sku) === key);
  const content = withCatalogueCategory({ ...live, ...product });
  const mapped = {
    'DH-IPC-HDW3667EM-S-IL-ANZ':'dahua-4k-turret', 'DH-IPC-HDW3867EM-S-IL-ANZ':'dahua-hdw3867',
    'DHI-NVR4104HS-P-4KS3':'dahua-nvr4104', 'DHI-NVR4108HS-8P-4KS3':'dahua-nvr4108',
    'DS-2CD2387G2H-LISU-SL':'hikvision-2387', 'DS-2CD2387G2H-LISU/SL':'hikvision-2387'
  }[product.sku] || product.id;
  const rich = createAlarmDetailContent(product) ||
    (product.id === 'curated-tiandy-tc-c36xn' ? details.tiandyC36Content :
      product.id === 'curated-tiandy-tc-h333k' ? details.tiandyH333Content : undefined) ||
    details.tiandyAdditionalDetailedContent[product.id] || details.tiandyAdditionalCameraContent[product.id] ||
    details.pdfDetailedProductContent[product.id] || details.nvrDetailedProductContent[product.id] ||
    details.dahuaDetailedContent[mapped] || details.accessoryDetailedContent[mapped];
  if (rich) {
    content.shortDescription = rich.descriptionTitle || content.shortDescription;
    content.description = rich.description || content.description;
    content.features = rich.features?.map(([title, description]) => description ? title + ': ' + description : title) || content.features;
    content.specifications = Object.fromEntries(rich.specifications || Object.entries(content.specifications || {}));
    content.detailContent = {
      overview: rich.overview || '', capabilities: rich.capabilities || [],
      recommendedApplications: rich.recommendedApplications || [], why: rich.why || '',
      idealUseCases: rich.idealUseCases || [],
      applications: rich.applications || [], installationNotes: rich.installationNotes || []
    };
  }
  const included = (alarmKitComponentIds[product.id] || []).map(id => {
    const component = alarmProducts.find(item => item.id === id);
    return { label: component ? alarmKitComponentDisplayName(product.id, component) : id, productId: id };
  });
  for (const [,label] of [...(paradoxKitSupplementalItems[product.id] || []), ...(arrowheadKitSupplementalItems[product.id] || []),
    ...(!included.length ? arrowheadKitIncludedItems[product.id] || [] : [])]) included.push({ label });
  content.includedItems = included;
  content.featured = featuredProductIds.includes(product.id);
  content.featuredOrder = Math.max(0, featuredProductIds.indexOf(product.id));
  content.subProducts = content.subProducts?.map(({ id, name, sku }) => ({ id, name, sku }));
  if (product.id === 'hikvision-ax-pro-security-kit' && !content.datasheetUrl)
    content.datasheetUrl = '/assets/DS-PWA96-Kit-WB_Datasheet_20230516.pdf';
  if (product.sku === 'DH-IPC-HDW3667EM-S-IL-ANZ')
    content.datasheetUrl ||= '/assets/DH-IPC-HDW3667EM-S-IL-ANZ-spec-sheet.pdf';
  const translated = localizeProduct(product, 'zh');
  if (translated !== product) content.translations = { zh: {
    name: translated.name, shortDescription: translated.shortDescription, description: translated.description,
    features: translated.features, specifications: translated.specifications
  }};
  for (const key of ['price','oldPrice','stock','priceOnRequest','requiresLiveCatalogue','sourceProductId','published']) delete content[key];
  content.name = clean(content.name);
  content.sku = clean(content.sku);
  content.routeAliases = [];
  records.set(key, content);
}
const seed = { version: 1, categories: catalogueCategories, products: [...records.values()] };
await writeFile('backend/catalogue-seed.json', JSON.stringify(seed, null, 2) + '\n');
console.log('Exported public content for ' + seed.products.length + ' unique SKUs.');
