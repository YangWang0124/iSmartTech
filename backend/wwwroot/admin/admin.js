const field = (label, type = 'text', options = {}) => ({ label, type, ...options });
const option = (label, flag, type = 'text', options = {}) => field(label, type, { flag, optional: true, ...options });
const sku = field('SKU');
const order = field('Order number', 'number', { min: 1 });
const tier = field('Price tier', 'select', { choices: [
  'S · Trade Price', 'S · (E) with QTY', 'S · (S) with BIG QTY', 'S · 1.53', 'S · 1.5', 'S · 1.45',
  'S · 1.38 Wholesaler Tier 1', 'P · (E) with QTY', 'P · (S) with BIG QTY', 'P · 1.53',
  'P · 1.5', 'P · 1.45', 'P · 1.38 Wholesaler Tier 1'
] });
const items = field('Items (SKU=quantity, one per line)', 'lines');
const quoteOptions = [option('Quote validity in days', '--days', 'number', { min: 1 }), { ...tier, optional: true, flag: '--tier' }];
const pricingActions = {
  pricing: ['View product pricing', 'Review the workbook’s Price (S) and Price (P) tiers.', [sku], 'Find product'],
  'cost-set': ['Set product cost', 'Enter the supplier cost. Leave it blank to clear the cost.', [
    sku, field('Cost', 'money', { optional: true, blank: 'clear' })
  ], 'Save cost'],
  'tier-set': ['Set tier price', '', [sku, tier, field('Price', 'money')], 'Save tier'],
  'tier-remove': ['Remove tier price', 'The tier price will be unavailable for future quotes for this SKU.', [sku, tier], 'Remove tier']
};
let allowedCommands = new Set();
let staffRolePermissions = {};
const groups = {
  Inventory: {
    inventory: ['Browse inventory', 'Search by SKU or product name and filter by brand or category.', [
      option('Search', '--search'), option('Brand', '--brand', 'select', { choices: [], all: 'All brands' }),
      option('Category', '--category', 'select', { choices: [], all: 'All categories' })
    ], 'Search'],
    'reorder-report': ['Low-stock report', 'Find active products with available stock at or below the threshold.', [
      field('Threshold', 'number', { min: 1 }), field('Brand', 'text', { optional: true })
    ], 'Run report']
  },
  Orders: { orders: ['Review orders', '', [], 'Review orders'] },
  Shipping: { fulfilments: ['Manage shipping', '', [], 'View shipping'] },
  Customers: { customers: ['Customer accounts', '', [], 'View customers'] },
  'Returns and refunds': { 'return-requests': ['Manage returns and refunds', '', [], 'View returns'] },
  Access: {
    staff: ['Create staff account', '', [field('Username'), field('Role', 'select', { choices: ['sales', 'warehouse', 'finance', 'owner'] }),
      field('New password', 'password')], 'Create account'],
    audit: ['View audit log', '', [], 'View latest entries']
  }
};

const get = id => document.getElementById(id);
const node = (tag, text) => {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  return element;
};

async function api(path, body) {
  const headers = body === undefined ? {} : { 'X-Admin-Request': '1' };
  if (body !== undefined && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const response = await fetch('/admin/api/' + path, {
    method: body === undefined ? 'GET' : 'POST', headers,
    body: body instanceof FormData ? body : JSON.stringify(body)
  });
  if (response.status === 204) return;
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const messages = { 401: 'Sign in with a valid staff account.', 403: 'You do not have access to this operation.', 429: 'Too many attempts. Try again in a minute.' };
    throw new Error(result.error || messages[response.status] || 'The server could not complete the request.');
  }
  return result;
}

function message(id, text, error = false) {
  const target = get(id);
  target.textContent = text;
  target.classList.toggle('error', error);
}

const money = new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' });
const label = key => key.replace(/_cents$/, '').replaceAll('_', ' ').replace(/^./, character => character.toUpperCase());
function valueText(key, value) {
  if (value === null || value === undefined) return '—';
  if (key.endsWith('_cents') || key === 'cents') return money.format(value / 100);
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'boolean' || key === 'active') return value ? 'Yes' : 'No';
  return String(value);
}

function showResult(value, target, editProduct) {
  if (Array.isArray(value)) {
    if (!value.length) { target.append(node('p', 'No records found.')); return; }
    const table = node('table');
    const columns = Object.keys(value[0]).filter(key => key !== 'on_hand');
    const head = table.createTHead().insertRow();
    columns.forEach(key => head.append(node('th', label(key))));
    if (editProduct) head.append(node('th', 'Action'));
    const body = table.createTBody();
    value.forEach(entry => {
      const row = body.insertRow();
      columns.forEach(key => row.append(node('td', valueText(key, entry[key]))));
      if (editProduct) {
        const edit = node('button', 'Edit');
        edit.addEventListener('click', () => editProduct(entry));
        row.insertCell().append(edit);
      }
    });
    target.append(table);
    return;
  }
  const list = node('dl');
  const nested = [];
  for (const [key, entry] of Object.entries(value)) {
    if (entry !== null && typeof entry === 'object') nested.push([key, entry]);
    else list.append(node('dt', label(key)), node('dd', valueText(key, entry)));
  }
  if (list.childNodes.length) target.append(list);
  for (const [key, entry] of nested) {
    target.append(node('h3', label(key)));
    showResult(entry, target);
  }
}

function inputFor(definition) {
  const { type, choices, optional, accept, min, label: name } = definition;
  const input = node(type === 'select' ? 'select' : type === 'lines' ? 'textarea' : 'input');
  if (type === 'select') {
    if (optional) input.append(new Option(definition.all || 'Select…', ''));
    choices.forEach(choice => input.append(new Option(choice, choice)));
  } else if (type !== 'lines') {
    input.type = type === 'money' ? 'number' : type;
    if (min !== undefined) input.min = min;
    if (type === 'money') { input.min = '0'; input.step = '0.01'; }
    if (accept) input.accept = accept;
    if (type === 'password') { input.minLength = 12; input.maxLength = 256; input.autocomplete = 'new-password'; }
  }
  input.required = !optional && type !== 'checkbox';
  const wrapper = node('label', name);
  wrapper.append(input);
  return { input, wrapper };
}

function displayProductText(value) {
  return value
    .replace(/^(?:\s*[(（]\s*(?:inactive|active|archived)\s*[)）]\s*)+/i, '')
    .trimStart() || value;
}

let thumbnailLookup;

function productThumbnail(sku, mainImage) {
  const thumb = node('span');
  thumb.className = 'product-thumbnail';
  thumb.setAttribute('aria-hidden', 'true');
  if (mainImage === '') return thumb;
  thumbnailLookup ??= fetch('/admin/thumbnails.json')
    .then(response => response.ok ? response.json() : {})
    .catch(() => ({}));
  thumbnailLookup.then(images => {
    if ((!mainImage && !Object.hasOwn(images, sku)) || !thumb.isConnected) return;
    const image = node('img');
    image.alt = '';
    image.width = 40;
    image.height = 40;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => image.remove(), { once: true });
    image.src = mainImage || '/admin/thumbnails/' + images[sku];
    thumb.append(image);
  });
  return thumb;
}

function renderInventory(records, target, onEdit, onPricing, page = 0, onStock) {
  if (!records.length) {
    target.append(node('p', 'No products match your search.'));
    return;
  }
  const pageSize = 50;
  page = Math.min(page, Math.ceil(records.length / pageSize) - 1);
  target.dataset.inventoryPage = page;
  const start = page * pageSize;
  const end = Math.min(start + pageSize, records.length);
  const list = node('ul');
  list.className = 'inventory-list';
  const pager = node('div');
  pager.className = 'form-actions';
  for (const [name, step, disabled] of [['Previous', -1, page === 0], ['Next', 1, end === records.length]]) {
    const button = node('button', name);
    button.disabled = disabled;
    button.onclick = () => {
      target.replaceChildren();
      renderInventory(records, target, onEdit, onPricing, page + step, onStock);
      target.querySelector('h3').focus();
    };
    pager.append(button);
  }
  const heading = node('h3', 'Products ' + (start + 1) + '–' + end + ' of ' + records.length);
  heading.tabIndex = -1;
  target.append(heading, list);
  for (const record of records.slice(start, end)) {
    const item = node('li');
    const product = node('div');
    product.className = 'inventory-product';
    const details = node('div');
    const title = node(onPricing ? 'button' : 'strong', displayProductText(record.name));
    if (onPricing) {
      title.type = 'button';
      title.className = 'product-title';
      title.setAttribute('aria-label', 'View pricing for ' + title.textContent);
      title.onclick = () => onPricing(record, page);
    }
    const metadata = node('p', [displayProductText(record.sku), record.brand, record.category].filter(Boolean).join(' · '));
    details.append(title, metadata);
    product.append(productThumbnail(record.sku, record.image), details);
    const stock = node('div');
    for (const mode of ['available', 'reserved']) {
      const count = node(onStock ? 'button' : 'span', record[mode] + ' ' + mode);
      count.className = 'stock-count stock-count--' + mode;
      if (onStock) {
        count.type = 'button';
        count.setAttribute('aria-label', 'Edit ' + mode + ' stock for ' + record.name);
        count.onclick = () => onStock(record, page, mode);
      }
      stock.append(count);
    }
    const actions = node('div');
    actions.className = 'inventory-actions';
    actions.append(node('span', record.active ? 'Active' : 'Archived'));
    for (const [buttonText, handler] of [['Pricing', onPricing], ['Edit', onEdit]]) {
      if (!handler) continue;
      const button = node('button', buttonText);
      button.addEventListener('click', () => handler(record, page));
      actions.append(button);
    }
    item.append(product, stock, actions);
    list.append(item);
  }
  if (records.length > pageSize) target.append(pager);
}

function renderPricing(response, target, backButton, editTier, editCost, removeTier) {
  const header = node('div');
  header.className = 'pricing-header';
  header.append(node('h2', displayProductText(response.product.name)), backButton);
  target.append(header);
  if (editCost) {
    const cost = node('div');
    cost.className = 'cost-summary';
    const button = node('button', response.cost_cents == null ? 'Add cost' : 'Edit cost');
    button.onclick = editCost;
    cost.append(node('strong', 'Cost'), node('span', valueText('cost_cents', response.cost_cents)), button);
    target.append(cost);
  }
  const layout = node('div');
  layout.className = 'price-grid';
  const grouped = new Map(response.tiers.map(item => [item.tier, item.cents]));
  for (const group of ['S', 'P']) {
    const heading = 'Price (' + group + ')';
    const entries = tier.choices.filter(name => name.startsWith(group + ' · '));
    const section = node('section');
    const prices = node('dl');
    section.append(node('h4', heading));
    section.append(prices);
    for (const key of entries) {
      const name = key.split(' · ')[1];
      let value = grouped.get(key);
      const amount = node('dd');
      const error = node('span');error.className = 'tier-row-error';error.setAttribute('role','alert');
      const draw = () => {
        amount.replaceChildren(node('span',valueText('cents',value)));
        if(editTier) {
          const edit=node('button',value==null?'Add':'Edit');edit.type='button';
          edit.setAttribute('aria-label',edit.textContent+' '+heading+' '+name);
          edit.onclick=()=>{
            const editor=node('div');editor.className='tier-inline-editor';
            const input=node('input');input.type='text';input.inputMode='decimal';input.autocomplete='off';
            input.setAttribute('aria-label',heading+' '+name+' price (NZD)');
            input.value=value==null?'':(value/100).toFixed(2);
            const save=node('button','Save');save.type='button';save.className='primary';
            save.setAttribute('aria-label','Save '+heading+' '+name);
            const cancel=node('button','Cancel');cancel.type='button';cancel.setAttribute('aria-label','Cancel '+heading+' '+name);
            cancel.onclick=draw;
            save.onclick=async()=>{
              const text=input.value.trim();
              const cents=Math.round(Number(text)*100);
              if(!/^\d+(?:\.\d{1,2})?$/.test(text)||!Number.isSafeInteger(cents)||cents<=0||cents>2147483647) {
                error.textContent='Enter a price greater than zero, with up to two decimal places.';input.focus();return;
              }
              error.textContent='';input.disabled=true;save.disabled=true;cancel.disabled=true;
              try {await editTier(key,cents);value=cents;draw();}
              catch(cause) {if(amount.isConnected)error.textContent=cause.message;}
              finally {input.disabled=false;save.disabled=false;cancel.disabled=false;}
            };
            input.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();save.click();}else if(event.key==='Escape'){event.preventDefault();if(!cancel.disabled)draw();}};
            editor.append(input,save,cancel);amount.replaceChildren(editor,error);error.textContent='';input.focus();input.select();
          };
          amount.append(edit);
        }
        if(removeTier&&value!=null) {
          const remove=node('button','Remove');remove.type='button';
          remove.setAttribute('aria-label','Remove '+heading+' '+name);
          remove.onclick=async()=>{
            amount.querySelectorAll('button').forEach(button=>{button.disabled=true;});error.textContent='';
            try {await removeTier(key);value=undefined;draw();}
            catch(cause) {if(amount.isConnected)error.textContent=cause.message;}
            finally {amount.querySelectorAll('button').forEach(button=>{button.disabled=false;});}
          };
          amount.append(remove);
        }
        error.textContent='';amount.append(error);
      };
      draw();
      prices.append(node('dt', name), amount);
    }
    layout.append(section);
  }
  target.append(layout);
}

const navigationToggle = get('navigation-toggle');
function setNavigationExpanded(expanded) {
  navigationToggle.setAttribute('aria-expanded', String(expanded));
}
navigationToggle.addEventListener('click', () => {
  setNavigationExpanded(navigationToggle.getAttribute('aria-expanded') !== 'true');
});

async function contentEditor(record, navButton, back) {
  const form = get('operation-form');
  form.classList.remove('inventory-toolbar');
  get('operation').hidden = false;
  const result = get('result');
  const operationCard = form.closest('.card');
  operationCard.hidden = false;
  result.hidden = true;
  result.replaceChildren();
  result.classList.remove('pricing-result');
  document.querySelectorAll('nav button').forEach(button => button.removeAttribute('aria-current'));
  navButton.setAttribute('aria-current', 'page');
  get('navigation-current').textContent = 'Product details';
  setNavigationExpanded(false);
  get('operation').textContent = record ? 'Edit product' : 'Add product';
  get('description').hidden = false;
  get('description').textContent = 'Edit the product details shown in the storefront. Optional sections can be left blank. Prices and stock are managed from the inventory list.';
  message('status', 'Loading product details…');
  form.replaceChildren();
  const marker = node('div');
  form.append(marker);
  const cancel = node('button', 'Cancel');
  cancel.type = 'button';
  const goBack = () => back ? back() : document.querySelector('nav button[data-command="inventory"]')?.click();
  cancel.onclick = goBack;
  marker.append(cancel);
  let data;
  let catalogueCategories = [];
  try {
    catalogueCategories = (await api('operations/inventory-options', { values: [] })).catalogueCategories || [];
    data = record ? await api('operations/product-details', { values: [record.sku] }) : {
      sku: '', name: '', brand: '', category: '', active: true, kind: 'other', channels: null
    };
  } catch (error) {
    if (marker.isConnected) message('status', error.message, true);
    return;
  }
  if (!marker.isConnected) return;
  form.replaceChildren();
  const fields = new Map();
  const addSection = title => {
    const section = node('fieldset');
    section.className = 'product-editor-section';
    section.append(node('legend', title));
    form.append(section);
    return section;
  };
  const add = (section, key, label, type = 'text', options = {}) => {
    const { input, wrapper } = inputFor(field(label, ['textblock','list','specs','json'].includes(type) ? 'lines' : type, {
      optional: !['sku', 'name', 'brand', 'category'].includes(key), ...options
    }));
    let value = key.includes('.') ? key.split('.').reduce((object, part) => object?.[part], data) : data[key];
    if (type === 'checkbox') input.checked = Boolean(value);
    else if (type === 'list') input.value = (value || []).join('\n');
    else if (type === 'specs') input.value = Object.entries(value || {}).map(([key, value]) => key + ' = ' + value).join('\n');
    else input.value = value ?? '';
    if (['textblock','list','specs'].includes(type)) {
      // inputFor supplies a textarea for multiline controls.
      input.rows = type === 'textblock' ? 5 : 4;
    }
    if (options.readOnly) input.readOnly = true;
    fields.set(key, { input, type });
    section.append(wrapper);
    return wrapper;
  };
  const rowEditors = new Map();
  const addRows = (section, key, title, columns, initial, asPairs = false, asSpecs = false) => {
    const group = node('div');
    group.className = 'editor-rows';
    group.append(node('h3', title));
    const rows = node('div');
    group.append(rows);
    const appendRow = value => {
      const row = node('div');
      row.className = 'editor-row';
      for (const [index, column] of columns.entries()) {
        const control = inputFor(field(column.label, column.multiline ? 'lines' : 'text', { optional: true }));
        control.input.value = ((asPairs || asSpecs) ? value?.[index] : value?.[column.key]) || '';
        row.append(control.wrapper);
      }
      const remove = node('button', 'Remove');
      remove.type = 'button';
      remove.onclick = () => row.remove();
      row.append(remove);
      rows.append(row);
    };
    for (const value of initial || []) appendRow(value);
    const addRow = node('button', 'Add ' + (asSpecs ? 'specification' : asPairs ? 'entry' : 'document'));
    addRow.type = 'button';
    addRow.onclick = () => appendRow();
    group.append(addRow);
    section.append(group);
    rowEditors.set(key, () => {
      const entries = [...rows.children].map(row => {
      const values = [...row.querySelectorAll('input,textarea')].map(input => input.value.trim());
      if (values.every(value => !value)) return null;
      if (values.some(value => !value)) throw new Error('Complete both fields in ' + title + ', or remove the row.');
      return (asPairs || asSpecs) ? values : Object.fromEntries(columns.map((column, index) => [column.key, values[index]]));
      }).filter(Boolean);
      if (asSpecs && new Set(entries.map(([name]) => name)).size !== entries.length)
        throw new Error('Specification names must be unique.');
      return asSpecs ? Object.fromEntries(entries) : entries;
    });
    return group;
  };
  const basic = addSection('Product');
  add(basic,'sku','SKU','text',{readOnly:Boolean(record)});
  add(basic,'name','Product name');
  add(basic,'brand','Brand');
  add(basic,'category','Category','select',{ choices: [...new Set([
    data.category || '', ...catalogueCategories.map(category => category.label)
  ])].filter(Boolean) });
  const currentCategory = catalogueCategories.find(category =>
    category.title === data.category &&
    (!data.categoryIds?.length || category.ids.at(-1) === data.categoryIds.at(-1)));
  if (currentCategory) fields.get('category').input.value = currentCategory.label;
  add(basic,'active','Active','checkbox');
  const copy = addSection('Descriptions and specifications');
  add(copy,'shortDescription','Short description','textblock');
  add(copy,'description','Description','textblock');
  add(copy,'features','Key features (one per line)','list');
  addRows(copy, 'specifications', 'Specifications', [{label:'Specification'},{label:'Value'}], Object.entries(data.specifications || {}), false, true);
  const media = addSection('Images and documents');
  const images = [...new Set([data.image, ...(data.galleryImages || [])].filter(Boolean))]
    .map(url => ({url, preview:url}));
  let mainImage = images[0];
  const gallery = node('div');
  gallery.className = 'image-editor';
  const imageCards = node('div');
  imageCards.className = 'image-editor__cards';
  const uploadLabel = node('label', 'Upload product images');
  const upload = node('input');
  upload.type = 'file';
  upload.multiple = true;
  upload.accept = 'image/png,image/jpeg,image/webp';
  uploadLabel.append(upload);
  gallery.append(uploadLabel, node('p', 'PNG, JPEG or WebP, up to 8 MB each. Select Main image below a preview.'), imageCards);
  media.append(gallery);
  const imageError = node('p');
  imageError.className = 'error';
  imageError.setAttribute('role', 'alert');
  gallery.append(imageError);
  const renderImages = () => {
    imageCards.replaceChildren();
    for (const image of images) {
      const card = node('div');
      card.className = 'image-editor__card';
      const preview = node('img');
      preview.src = image.preview;
      preview.alt = 'Product image preview';
      const selectLabel = node('label', 'Main image');
      const radio = node('input');
      radio.type = 'radio';
      radio.name = 'main-product-image';
      radio.checked = image === mainImage;
      radio.onchange = () => { mainImage = image; renderImages(); };
      selectLabel.prepend(radio);
      const remove = node('button', 'Remove');
      remove.type = 'button';
      remove.onclick = () => {
        images.splice(images.indexOf(image), 1);
        if (image.file) URL.revokeObjectURL(image.preview);
        if (image === mainImage) mainImage = images[0];
        renderImages();
      };
      const change = node('button', 'Change image');
      change.type = 'button';
      change.setAttribute('aria-label', 'Change image ' + (images.indexOf(image) + 1));
      const replacement = node('input');
      replacement.type = 'file';
      replacement.accept = 'image/png,image/jpeg,image/webp';
      replacement.hidden = true;
      change.onclick = () => replacement.click();
      replacement.onchange = async () => {
        const file = replacement.files[0];
        replacement.value = '';
        if (!file) return;
        imageError.textContent = '';
        if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) {
          imageError.textContent = 'Choose a PNG, JPEG or WebP image under 8 MB.';
          return;
        }
        save.disabled = true;
        media.disabled = true;
        try {
          const bitmap = await createImageBitmap(file);
          bitmap.close();
          if (!gallery.isConnected || !images.includes(image)) return;
          const next = {file, preview:URL.createObjectURL(file)};
          images[images.indexOf(image)] = next;
          if (mainImage === image) mainImage = next;
          if (image.file) URL.revokeObjectURL(image.preview);
          renderImages();
        } catch {
          imageError.textContent = 'This image could not be read. Your original image has been kept.';
        } finally {
          save.disabled = false;
          media.disabled = false;
        }
      };
      const imageActions = node('div');
      imageActions.className = 'image-editor__actions';
      imageActions.append(remove, change);
      card.append(preview, selectLabel, imageActions, replacement);
      imageCards.append(card);
    }
  };
  upload.onchange = async () => {
    imageError.textContent = '';
    const files = [...upload.files];
    save.disabled = true;
    upload.value = '';
    for (const file of files) {
      if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) {
        imageError.textContent = 'Choose PNG, JPEG or WebP images under 8 MB each.';
        continue;
      }
      try {
        const bitmap = await createImageBitmap(file);
        bitmap.close();
        if (!gallery.isConnected) return;
        if (images.some(image => image.file && image.file.name === file.name && image.file.size === file.size && image.file.lastModified === file.lastModified)) continue;
        const image = {file, preview:URL.createObjectURL(file)};
        images.push(image);
        mainImage ||= image;
      } catch { imageError.textContent = 'This image could not be read. Choose a valid PNG, JPEG or WebP image.'; }
    }
    renderImages();
    save.disabled = false;
  };
  renderImages();
  cancel.onclick = () => {
    for (const image of images) if (image.file) URL.revokeObjectURL(image.preview);
    goBack();
  };
  add(media,'datasheetUrl','Datasheet URL');
  addRows(media, 'specSheetLinks', 'Additional documents', [{key:'label',label:'Document name'},{key:'url',label:'Document URL'}], data.specSheetLinks);
  add(media,'sourceUrl','Supplier page URL');
  const detail = addSection('Additional product information');
  const optionalSections = [];
  const hasContent = value => Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
  const optional = (key, title, create) => {
    const wrapper = create();
    wrapper.hidden = !hasContent(data.detailContent?.[key]);
    optionalSections.push({title, wrapper});
  };
  optional('overview', 'Overview', () => add(detail,'detailContent.overview','Overview','textblock'));
  optional('why', 'Product benefits', () => add(detail,'detailContent.why','Product benefits','textblock'));
  for (const [key,label] of [['capabilities','Capabilities'],['recommendedApplications','Recommended applications'],['idealUseCases','Ideal use cases']])
    optional(key, label, () => addRows(detail, 'detailContent.' + key, label,
      [{label:'Title'},{label:'Description',multiline:true}], data.detailContent?.[key], true));
  optional('applications', 'Typical applications', () => add(detail,'detailContent.applications','Typical applications (one per line)','list'));
  optional('installationNotes', 'Installation notes', () => add(detail,'detailContent.installationNotes','Installation notes (one per line)','list'));
  const sectionPicker = inputFor(field('Add optional information', 'select', {optional:true, choices:['Choose a section']}));
  const refreshSections = () => {
    sectionPicker.input.replaceChildren(new Option('Choose a section', ''),
      ...optionalSections.filter(section => section.wrapper.hidden).map(section => new Option(section.title, section.title)));
    sectionPicker.wrapper.hidden = !optionalSections.some(section => section.wrapper.hidden);
  };
  sectionPicker.input.onchange = () => {
    const section = optionalSections.find(section => section.title === sectionPicker.input.value);
    if (section) { section.wrapper.hidden = false; refreshSections(); }
  };
  detail.append(sectionPicker.wrapper);
  refreshSections();
  const attributes = addSection('Options and catalogue filters');
  add(attributes,'colors','Colours (one per line)','list');
  const filterGroups = [
    ['Resolution', [[216,'2 MP'],[217,'4 MP'],[245,'5 MP'],[218,'6 MP'],[219,'8 MP']]],
    ['Environment', [[246,'Indoor'],[247,'Outdoor']]],
    ['Connection', [[251,'Wired'],[249,'Analog'],[248,'Wi-Fi'],[224,'4G']]],
    ['Camera Features', [[223,'Solar'],[252,'Alarm LED']]],
    ['Colour Mode', [[222,'Full Colour'],[250,'Not Full Colour']]],
    ['Camera Shape', [[234,'Turret'],[233,'Dome'],[232,'Bullet'],[192,'PTZ']]]
  ];
  const filterControls = [];
  const knownTags = new Set();
  for (const [title, choices] of filterGroups) {
    const group = node('fieldset');
    group.className = 'technical-filter-group';
    group.append(node('legend', title));
    for (const [id, label] of choices) {
      knownTags.add(id);
      const control = inputFor(field(label, 'checkbox', {optional:true}));
      control.input.checked = (data.tagIds || []).includes(id);
      filterControls.push({id, input:control.input});
      group.append(control.wrapper);
    }
    attributes.append(group);
    group.dataset.filterTitle = title;
  }
  const cameraCategories = new Set([9,13,14,15,16,17]);
  const updateProductFields = () => {
    const selected = catalogueCategories.find(category => category.label === fields.get('category').input.value);
    const categoryIds = selected?.ids || data.categoryIds || [];
    const category = (selected?.title || fields.get('category').input.value || '').toLowerCase();
    // Use the catalogue hierarchy first; legacy imports may only have a category name.
    const camera = categoryIds.some(id => cameraCategories.has(id)) ||
      (!selected && /\bcameras?\b/.test(category) && !/accessor|bracket|mount|kit|record/.test(category));
    const selectedTags = new Set(filterControls.filter(control => control.input.checked).map(control => control.id));
    for (const [title, choices] of filterGroups) {
      const group = [...attributes.querySelectorAll('[data-filter-title]')].find(group => group.dataset.filterTitle === title);
      const general = title === 'Environment' || title === 'Connection';
      group.hidden = !camera && !(general && choices.some(([id]) => selectedTags.has(id)));
      // Hidden controls retain their values, but are never offered as options for unrelated products.
    }
  };
  fields.get('category').input.addEventListener('change', updateProductFields);
  updateProductFields();

  const actions = node('div');
  actions.className = 'form-actions';
  const save = node('button','Save product');
  save.className = 'primary';
  actions.append(save,cancel);
  form.append(actions);
  message('status','');
  form.onsubmit = async event => {
    event.preventDefault();
    const payload = {};
    const set = (key,value) => {
      const parts=key.split('.');
      let current=payload;
      for(const part of parts.slice(0,-1)) current=current[part] ??= {};
      current[parts.at(-1)]=value;
    };
    try {
      for (const [key,{input,type,empty}] of fields) {
        if (key === 'sku') continue;
        let value=input.value.trim();
        if (type === 'checkbox') value=input.checked;
        else if (type === 'list') value=value.split('\n').map(line=>line.trim()).filter(Boolean);
        else if (type === 'specs') {
          const pairs=value.split('\n').map(line=>line.trim()).filter(Boolean).map(line=>{
            const separator=line.indexOf('=');
            if(separator<1) { input.focus(); throw new Error('Use Name = value for specifications.'); }
            return [line.slice(0,separator).trim(),line.slice(separator+1).trim()];
          });
          if(new Set(pairs.map(([key])=>key)).size!==pairs.length) throw new Error('Specification names must be unique.');
          value=Object.fromEntries(pairs);
        } else if (type === 'number') value=value === '' ? (key==='channels' ? null : 0) : Number(value);
        set(key,value);
      }
      for (const [key, read] of rowEditors) set(key, read());
      const selectedCategory = catalogueCategories.find(category => category.label === payload.category);
      if (selectedCategory) {
        payload.category = selectedCategory.title;
        payload.categoryIds = selectedCategory.ids;
      } else if (payload.category !== data.category) payload.categoryIds = [];
      payload.tagIds = [...(data.tagIds || []).filter(id => !knownTags.has(id)),
        ...filterControls.filter(control => control.input.checked).map(control => control.id)];
      save.disabled=true;
      cancel.disabled=true;
      message('status','Saving…');
      media.disabled = true;
      for (const image of images) {
        if (image.url) continue;
        const body = new FormData();
        body.append('file', image.file);
        image.url = (await api('images', body)).url;
      }
      payload.image = mainImage?.url || '';
      payload.galleryImages = [...new Set(images.filter(image => image !== mainImage).map(image => image.url))]
        .filter(url => url !== payload.image);
      payload.featureImages = [];
      const saved = await api('operations/product-content',{values:[fields.get('sku').input.value.trim(),JSON.stringify(payload)]});
      if (!save.isConnected) return;
      for (const image of images) if (image.file) URL.revokeObjectURL(image.preview);
      if (allowedCommands.has('pricing')) {
        operation('pricing', pricingActions.pricing, navButton, saved, goBack);
        window.scrollTo(0, 0);
      } else goBack();
    } catch(error) {
      if(save.isConnected) message('status',error.message,true);
    } finally { save.disabled=false; cancel.disabled=false; media.disabled=false; }
  };
}

async function stockEditor(record, mode, navButton, back) {
  const form = get('operation-form');
  const result = get('result');
  form.classList.remove('inventory-toolbar');
  form.closest('.card').hidden = false;
  get('operation').hidden = false;
  get('operation').textContent = 'Edit ' + mode + ' stock';
  get('description').hidden = false;
  get('description').textContent = record.name + ' · ' + record.sku;
  result.hidden = true;
  result.replaceChildren();
  result.classList.remove('pricing-result');
  message('status', 'Loading stock…');
  const marker = node('div');
  form.replaceChildren(marker);
  const cancel = node('button', 'Cancel');
  cancel.type = 'button';
  cancel.onclick = back;
  marker.append(cancel);
  let current;
  try {
    current = await api('operations/stock-details', { values: [record.sku] });
  } catch (error) {
    if (marker.isConnected) message('status', error.message, true);
    return;
  }
  if (!marker.isConnected) return;
  get('navigation-current').textContent = 'Edit ' + mode + ' stock';
  setNavigationExpanded(false);
  const quantity = inputFor(field(mode === 'available' ? 'Available quantity' : 'Reserved quantity', 'number', { min: 0 }));
  quantity.input.value = current[mode];
  if (mode === 'reserved') quantity.input.max = current.available + current.reserved;
  const balances = node('p', current.available + ' available · ' + current.reserved + ' reserved' +
    (current.order_reserved ? ' · ' + current.order_reserved + ' reserved by orders' : ''));
  balances.className = 'stock-balances';
  const save = node('button', 'Save stock');
  save.className = 'primary';
  const actions = node('div');
  actions.className = 'form-actions';
  actions.append(save, cancel);
  form.replaceChildren(balances, quantity.wrapper, actions);
  message('status', '');
  form.onsubmit = async event => {
    event.preventDefault();
    save.disabled = true;
    cancel.disabled = true;
    message('status', 'Saving…');
    try {
      await api('operations/stock-set', { values: [
        record.sku, mode, quantity.input.value, String(current.available), String(current.reserved)
      ] });
      if (save.isConnected) back();
    } catch (error) {
      if (save.isConnected) message('status', error.message, true);
    } finally { save.disabled = false; cancel.disabled = false; }
  };
}

function inventorySuggestions(form, controls) {
  const input = controls[0].input;
  input.maxLength = 200;
  const container = node('div');
  container.className = 'search-autocomplete';
  controls[0].wrapper.replaceWith(container);
  const list = node('div');
  list.id = 'inventory-suggestions';
  list.className = 'search-suggestions';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', 'Matching products');
  list.hidden = true;
  const feedback = node('span');
  feedback.className = 'search-feedback';
  feedback.setAttribute('role', 'status');
  container.append(controls[0].wrapper, list, feedback);
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-controls', list.id);
  input.setAttribute('aria-expanded', 'false');
  input.autocomplete = 'off';
  let timer;
  let generation = 0;
  let matches = [];
  let active = -1;
  const close = () => {
    clearTimeout(timer);
    generation++;
    matches = [];
    active = -1;
    list.hidden = true;
    list.replaceChildren();
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    feedback.textContent = '';
  };
  const choose = record => {
    input.value = record.sku;
    close();
    input.focus();
    form.requestSubmit();
  };
  const highlight = index => {
    active = index;
    for (const [position, option] of [...list.children].entries())
      option.setAttribute('aria-selected', String(position === index));
    const selected = list.children[index];
    input.setAttribute('aria-activedescendant', selected.id);
    selected.scrollIntoView({ block: 'nearest' });
  };
  const suggest = () => {
    close();
    const phrase = input.value.trim();
    if (!phrase) return;
    const request = generation;
    const values = [phrase];
    for (const [index, flag] of [[1, '--brand'], [2, '--category']])
      if (controls[index].input.value) values.push(flag, controls[index].input.value);
    timer = setTimeout(async () => {
      try {
        const records = await api('operations/inventory-suggest', { values });
        if (request !== generation || !input.isConnected || document.activeElement !== input) return;
        matches = records;
        feedback.textContent = records.length ? records.length + (records.length === 1 ? ' suggestion.' : ' suggestions.') + ' Use up and down arrows to choose.' : 'No matching products.';
        for (const [index, record] of records.entries()) {
          const option = node('button');
          option.type = 'button';
          option.id = 'inventory-suggestion-' + index;
          option.setAttribute('role', 'option');
          option.setAttribute('aria-selected', 'false');
          option.tabIndex = -1;
          option.append(node('strong', record.name),
            node('span', [record.sku, record.brand, record.active ? 'Active' : 'Archived'].join(' · ')));
          option.addEventListener('pointerdown', event => {
            if (event.pointerType === 'mouse') event.preventDefault();
          });
          option.addEventListener('click', event => { event.preventDefault(); choose(record); });
          list.append(option);
        }
        list.hidden = !records.length;
        input.setAttribute('aria-expanded', String(records.length > 0));
      } catch {
        if (request === generation && input.isConnected)
          feedback.textContent = 'Suggestions unavailable. You can still use Search.';
      }
    }, 180);
  };
  input.addEventListener('input', event => { if (!event.isComposing) suggest(); });
  input.addEventListener('compositionstart', close);
  input.addEventListener('compositionend', suggest);
  input.addEventListener('focus', suggest);
  for (const index of [1, 2]) controls[index].input.addEventListener('change', close);
  container.addEventListener('focusout', event => {
    if (!container.contains(event.relatedTarget)) close();
  });
  input.addEventListener('keydown', event => {
    if (event.isComposing) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    else if (matches.length && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      const next = active < 0 ? (event.key === 'ArrowDown' ? 0 : matches.length - 1) :
        (active + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length;
      highlight(next);
    } else if (event.key === 'Enter' && active >= 0) {
      event.preventDefault();
      choose(matches[active]);
    }
  });
  return close;
}

async function commerceWorkspace(module, navButton, selectedOrder) {
  const form = get('operation-form');
  form.classList.remove('inventory-toolbar');
  form.closest('.card').hidden = false;
  form.onsubmit = event => event.preventDefault();
  get('operation').hidden = false;
  const titles = {orders:'Orders',fulfilments:'Shipping',customers:'Customers','return-requests':'Returns and refunds'};
  get('operation').textContent = titles[module];
  get('description').hidden = true;
  get('result').hidden = true;
  get('result').replaceChildren();
  document.querySelectorAll('nav button').forEach(button => button.removeAttribute('aria-current'));
  navButton.setAttribute('aria-current','page');
  get('navigation-current').textContent = titles[module];
  setNavigationExpanded(false);
  const screen = node('div'); screen.className = 'commerce-screen'; form.replaceChildren(screen);
  message('status','Loading…');
  const reload = orderId => commerceWorkspace(module, navButton, orderId);
  const button = (label, action, primary = false) => {
    const control = node('button', label); control.type = 'button';
    if (primary) control.className = 'primary';
    control.onclick = async () => {
      control.disabled = true;
      try { await action(); } catch(error) { if(screen.isConnected) message('status',error.message,true); }
      finally { control.disabled = false; }
    };
    return control;
  };
  const run = (command, payload) => api('operations/'+command,{values:[JSON.stringify(payload)]});
  const table = (headings, records, cells) => {
    const wrap=node('div');wrap.className='commerce-table';
    const table=node('table');const header=table.createTHead().insertRow();
    headings.forEach(title=>header.append(node('th',title)));
    const body=table.createTBody();
    for(const record of records) {
      const row=body.insertRow();
      for(const cell of cells(record)) {const td=row.insertCell();td.append(cell instanceof Node ? cell : document.createTextNode(String(cell ?? '—')));}
    }
    wrap.append(table);
    if(!records.length) wrap.append(node('p','No records found.'));
    screen.append(wrap);
  };
  const panel = (title, definitions, initial, saveLabel, onSave) => {
    const section=node('fieldset');section.className='commerce-form';section.append(node('legend',title));
    const controls={};
    for(const [key,label,type='text',options={}] of definitions) {
      const wrapper=node('label',label);const input=node(type==='textarea'?'textarea':type==='select'?'select':'input');
      if(type!=='textarea'&&type!=='select') input.type=type;
      input.required=options.required!==false && type!=='checkbox';
      if(type==='select') for(const choice of options.choices || []) {
        const [value,text]=Array.isArray(choice)?choice:[choice,choice];input.append(new Option(text,value));
      }
      if(type==='checkbox') input.checked=Boolean(initial[key]);else input.value=initial[key]??'';
      if(options.min!==undefined)input.min=options.min;
      if(options.step!==undefined)input.step=options.step;
      if(options.readOnly)input.readOnly=true;
      wrapper.append(input);section.append(wrapper);controls[key]=input;
    }
    const actions=node('div');actions.className='form-actions';
    const save=button(saveLabel,async()=>{
      if(![...section.querySelectorAll('input,select,textarea')].every(input=>input.reportValidity()))return;
      const payload=Object.fromEntries(Object.entries(controls).map(([key,input])=>[key,input.type==='checkbox'?input.checked:input.value.trim()]));
      section.disabled=true;message('status','Saving…');
      try{await onSave(payload,controls);}
      finally{section.disabled=false;}
    },true);
    actions.append(save,button('Cancel',()=>reload()));section.append(actions);screen.append(section);
    return {section,controls,actions};
  };
  const statusText = order => order.status==='reserved'&&order.shipping_pending?'Awaiting delivery charge':order.fulfilment_status==='collected'?'Collected':({quoted:'Awaiting confirmation',reserved:'Awaiting payment',paid:'Paid',dispatched:'Dispatched',cancelled:'Cancelled'}[order.status]||order.status);
  try {
    const data=await api('operations/commerce-data',{values:[]});
    if(!screen.isConnected)return;
    message('status','');
    const actions=node('div');actions.className='form-actions';screen.append(actions);
    const returnList=()=>reload();
    if(module==='customers') {
      const edit = customer => {
        screen.replaceChildren(button('Back to customers',returnList));
        const fields=[['name','Customer name'],['email','Email','email'],['company','Company','text',{required:false}],['phone','Phone','tel',{required:false}],
          ['address','Delivery address','textarea',{required:false}],['price_tier','Purchasing price tier','select',{choices:data.tiers}],
          ['active','Account active','checkbox'],['can_purchase','Allow purchases','checkbox']];
        panel(customer.id?'Edit customer':'Add customer',fields,{price_tier:'S · Trade Price',active:true,can_purchase:true,...customer},'Save customer',async payload=>{
          await run('customer-save',{...payload,id:String(customer.id||''),version:String(customer.version||'')});await reload();
        });
      };
      if(allowedCommands.has('customer-save'))actions.append(button('Add customer',()=>edit({}),true));
      screen.append(node('p','Manage purchasing eligibility and company price tiers. Existing customers need a sign-up invitation to create their storefront login.'));
      table(['Customer','Email','Company','Purchasing','Price tier','Action'],data.customers,c=>[c.name,c.email,c.company,
        !c.active?'Suspended':c.can_purchase?'Allowed':'Blocked',c.price_tier,(()=>{const actions=node('div');actions.className='form-actions';actions.append(button('Edit',()=>edit(c)));if(allowedCommands.has('customer-invite'))actions.append(button('Sign-up invitation',async()=>{const result=await run('customer-invite',{customer_id:String(c.id)});message('status','Share this invitation securely with '+c.email+'. It expires in 48 hours: '+result.invitation);}));return actions;})()]);
      return;
    }
    const orderDetail = async id => {
      const order=await api('operations/commerce-order',{values:[String(id)]});if(!screen.isConnected)return;
      screen.replaceChildren(button('Back to '+titles[module].toLowerCase(),returnList));
      screen.append(node('h3','Order #'+order.id),node('p',(order.customer?.customer_name||'Customer not linked')+' · '+statusText(order)+' · '+money.format(order.total_cents/100)));
      screen.append(node('p','Payment reference: '+(order.payment?.reference||order.payment_ref||'Not recorded')));
      table(['SKU','Quantity','Unit price','Line total'],order.lines,line=>[line.sku,line.quantity,money.format(line.unit_cents/100),money.format(line.quantity*line.unit_cents/100)]);
      if(module==='orders' && allowedCommands.has('cancel') && order.status==='reserved')
        screen.append(button('Cancel order and release stock',async()=>{await api('operations/cancel',{values:[String(id)]});await reload(id);}));
      if(order.shipping_pending) {
        screen.append(node('p','Delivery charges must be confirmed before payment. The customer will see the confirmed total in their account.'));
        if(allowedCommands.has('order-shipping')&&order.status==='reserved')panel('Confirm delivery charge',[
          ['shipping','Shipping charge (NZD)','number',{min:'0',step:'0.01'}]
        ],{},'Confirm shipping charge',async payload=>{await run('order-shipping',{order_id:String(id),shipping_cents:String(Math.round(Number(payload.shipping)*100))});await reload(id);});
      }
      if(order.shipping_cents!==null&&order.shipping_cents!==undefined)screen.append(node('p','Shipping charge: '+money.format(order.shipping_cents/100)));
      if(order.installation_cents)screen.append(node('p','Installation: '+money.format(order.installation_cents/100)+' · '+order.installation_details));
      if(module==='orders' && allowedCommands.has('order-payment') && order.status==='reserved'&&!order.shipping_pending) {
        screen.append(node('p','Record a payment already received. This does not charge a card or contact a payment provider.'));
        panel('Payment',[['amount','Amount received (NZD)','number',{min:'0.01',step:'0.01'}],['method','Payment method','select',{choices:['bank transfer','card','other']}],['reference','Transaction reference']],
          {amount:(order.total_cents/100).toFixed(2),method:'bank transfer'},'Record received payment',async payload=>{
            await run('order-payment',{order_id:String(id),amount_cents:String(Math.round(Number(payload.amount)*100)),method:payload.method,reference:payload.reference});await reload(id);
          });
      }
      const fulfilment=order.fulfilment||{method:'delivery',status:'queued',version:0};
      if(module==='fulfilments' && allowedCommands.has('fulfilment-save') && ['reserved','paid'].includes(order.status)) {
        const editor=panel('Prepare shipment',[
          ['status','Progress','select',{choices:[['queued','Queued'],['preparing','Preparing'],['ready','Ready to ship'],['dispatched','Dispatched']]}],
          ['address','Delivery address','textarea',{required:false}],['carrier','Carrier','text',{required:false}],['tracking','Tracking number','text',{required:false}],
          ['notes','Notes','textarea',{required:false}],['serials','Serial numbers, if applicable (SKU=serial1,serial2 per line)','textarea',{required:false}]
        ],fulfilment,'Save shipping',async payload=>{await run('fulfilment-save',{...payload,method:'delivery',order_id:String(id),version:String(fulfilment.version)});await reload(id);});
      } else {
        screen.append(node('h4','Shipping'),node('p',fulfilment.status),
          node('p',fulfilment.address||'Delivery address not set'),
          node('p',[fulfilment.carrier,fulfilment.tracking].filter(Boolean).join(' · ')));
      }
    };
    if(selectedOrder){await orderDetail(selectedOrder);return;}
    const createOrder = async () => {
      screen.replaceChildren(button('Back to orders',returnList));
      const eligible=data.customers.filter(customer=>customer.active&&customer.can_purchase);
      if(!eligible.length){screen.append(node('p','Add an active customer with purchasing permission first.'));return;}
      const products=await fetch('/api/retail/products').then(response=>response.json());if(!screen.isConnected)return;
      const rows=[];
      const items=node('div');items.className='commerce-order-items';
      const addLine=()=>{
        const row=node('div');row.className='commerce-order-line';
        const label=node('label','Product');const select=node('select');
        select.append(new Option('Choose product',''));products.forEach(product=>select.append(new Option(product.name+' · '+product.sku,product.sku)));
        const qtyLabel=node('label','Quantity');const qty=node('input');qty.type='number';qty.min=1;qty.step=1;qty.value=1;
        label.append(select);qtyLabel.append(qty);row.append(label,qtyLabel,button('Remove',()=>{rows.splice(rows.indexOf(entry),1);row.remove();}));
        const entry={select,qty};rows.push(entry);items.append(row);
      };
      const editor=panel('Create customer order',[
        ['customer_id','Customer','select',{choices:eligible.map(customer=>[String(customer.id),customer.name+' · '+customer.price_tier])}]
      ],{customer_id:String(eligible[0].id),method:'delivery'},'Create order and reserve stock',async payload=>{
        if(!rows.length||rows.some(row=>!row.select.value||!row.qty.reportValidity()))throw new Error('Choose products and positive quantities.');
        const order=await run('order-create',{...payload,method:'delivery',items:rows.map(row=>({sku:row.select.value,quantity:row.qty.value}))});await reload(order.id);
      });
      editor.section.insertBefore(items,editor.actions);editor.section.insertBefore(button('Add product',addLine),editor.actions);addLine();
      return;
    };
    if(module==='orders'||module==='fulfilments') {
      actions.append(button('Refresh',()=>reload()));
      if(module==='orders'&&allowedCommands.has('order-create'))actions.append(button('Create order',createOrder,true));
      const searchLabel=node('label','Search orders');const search=node('input');search.type='search';search.placeholder='Order number, customer, email or tracking';searchLabel.append(search);screen.append(searchLabel);
      const draw = () => {
        screen.querySelector('.commerce-table')?.remove();
        const term=search.value.toLowerCase();
        const orders=data.orders.filter(order=>(module!=='fulfilments'||!['quoted','cancelled'].includes(order.status))&&
          [order.id,order.customer_name,order.customer_email,order.tracking].some(value=>String(value||'').toLowerCase().includes(term)));
        table(['Order','Customer','Total','Status','Payment reference','Shipping','Action'],orders,order=>[
          '#'+order.id,order.customer_name||'Not linked',money.format((order.total_cents||0)/100),statusText(order),order.payment_ref||'Not recorded',
          [order.method,order.fulfilment_status].filter(Boolean).join(' · ')||'Not set',button('Open',()=>orderDetail(order.id))]);
      };search.oninput=draw;draw();return;
    }
    if(module==='return-requests') {
      const requestReturn = async () => {
        screen.replaceChildren(button('Back to returns',returnList));
        const orders=data.orders.filter(order=>order.status==='dispatched');
        if(!orders.length){screen.append(node('p','There are no fulfilled orders to return.'));return;}
        const editor=panel('Request a return',[
          ['order_id','Order','select',{choices:orders.map(order=>[String(order.id),'#'+order.id+' · '+(order.customer_name||'Customer not linked')])}],
          ['sku','Product','select',{choices:[]}],['quantity','Quantity','number',{min:1,step:1}],['reason','Return reason','textarea'],['serial','Serial number, if recorded','text',{required:false}]
        ],{order_id:String(orders[0].id),quantity:1},'Submit return request',async payload=>{await run('return-request',payload);await reload();});
        const load=async()=>{const order=await api('operations/commerce-order',{values:[editor.controls.order_id.value]});
          editor.controls.sku.replaceChildren(...order.lines.map(line=>new Option(line.sku+' · '+line.quantity+' purchased',line.sku)));};
        editor.controls.order_id.onchange=()=>load().catch(error=>message('status',error.message,true));await load();
      };
      actions.append(button('Refresh',()=>reload()));
      if(allowedCommands.has('return-request'))actions.append(button('Request return',requestReturn,true));
      table(['Request','Order / product','Quantity','Reason','Status','Refund','Action'],data.returns,request=>{
        const controls=node('div');controls.className='form-actions';
        if(allowedCommands.has('return-process')&&request.status==='requested')for(const decision of ['approved','rejected'])controls.append(button(decision==='approved'?'Approve':'Reject',async()=>{await run('return-process',{request_id:String(request.id),decision});await reload();}));
        if(allowedCommands.has('return-process')&&request.status==='approved')controls.append(button('Receive and inspect',()=>{
          screen.replaceChildren();panel('Receive return #'+request.id,[['sellable','Inspected and suitable for resale','checkbox']],{sellable:false},'Receive returned goods',async payload=>{
            await run('return-process',{...payload,request_id:String(request.id),decision:'received'});await reload();});
        }));
        if(allowedCommands.has('refund-record')&&request.status==='received'&&!request.refunded_cents)controls.append(button('Record refund',()=>{
          screen.replaceChildren();screen.append(node('p','Record a refund already completed with your bank or payment provider. This does not transfer money.'));
          panel('Refund for return #'+request.id,[['amount','Refund amount (NZD)','number',{readOnly:true}],['reference','Refund transaction reference']],{amount:(request.refund_due_cents/100).toFixed(2)},'Record completed refund',async payload=>{
            await run('refund-record',{request_id:String(request.id),amount_cents:String(request.refund_due_cents),reference:payload.reference});await reload();});
        }));
        return ['#'+request.id,'#'+request.order_id+' · '+request.product_name,request.quantity,request.reason,request.status,
          request.refunded_cents?money.format(request.refunded_cents/100)+' · '+request.refund_reference:request.refund_due_cents?money.format(request.refund_due_cents/100)+' due':'Pending inspection',controls];
      });
      if(data.legacyReturns.length){screen.append(node('h3','Previously recorded returns'));
        table(['Return','Order','SKU','Quantity','Recorded value'],data.legacyReturns,item=>[item.id,item.order_id,item.sku,item.quantity,money.format(item.refund_cents/100)]);}
    }
  } catch(error){if(screen.isConnected)message('status',error.message,true);}
}

function operation(command, definition, navButton, record, back) {
  if (['orders','fulfilments','customers','return-requests'].includes(command)) {
    void commerceWorkspace(command, navButton);
    return;
  }
  if (command === 'product') {
    void contentEditor(record, navButton, back);
    return;
  }
  const [title, description, definitions, action] = definition;
  document.querySelectorAll('nav button').forEach(button => button.removeAttribute('aria-current'));
  navButton.setAttribute('aria-current', 'page');
  get('navigation-current').textContent = navButton.textContent;
  setNavigationExpanded(false);
  get('operation').textContent = title;
  get('description').textContent = description;
  get('description').hidden = !description;
  get('operation').hidden = command === 'inventory';
  if (command === 'inventory') get('description').hidden = true;
  const form = get('operation-form');
  form.classList.toggle('inventory-toolbar', command === 'inventory');
  const operationCard = form.closest('.card');
  operationCard.hidden = false;
  const result = get('result');
  result.hidden = true;
  result.classList.remove('pricing-result');
  result.replaceChildren();
  message('status', '');
  const controls = definitions.map(inputFor);
  if (record && command === 'pricing') controls[0].input.value = record.sku;
  if (command === 'cost-set' && record) {
    controls[0].input.value = record.sku;
    controls[0].input.readOnly = true;
    if (record.cents != null) controls[1].input.value = (record.cents / 100).toFixed(2);
  }
  if (['tier-set', 'tier-remove'].includes(command) && record) {
    controls[0].input.value = record.sku;
    controls[0].input.readOnly = true;
    controls[1].input.value = record.tier;
    if (command === 'tier-set' && record.cents != null) controls[2].input.value = (record.cents / 100).toFixed(2);
  }
  const submit = node('button', action);
  submit.className = 'primary';
  const actions = node('div');
  actions.className = 'form-actions';
  actions.append(submit);
  if (command === 'inventory') {
    const all = node('button', 'All products');
    all.type = 'button';
    all.onclick = () => {
      if (submit.disabled) return;
      for (const { input } of controls) input.value = '';
      form.requestSubmit();
    };
    actions.append(all);
    if (allowedCommands.has('product-content')) {
      const add = node('button', 'Add');
      add.type = 'button';
      add.onclick = () => {
        const filters = controls.map(({ input }) => input.value);
        const page = Number(result.dataset.inventoryPage || 0);
        const scrollTop = window.scrollY;
        void contentEditor(null, navButton, () => operation(command, definition, navButton, { filters, page, scrollTop }));
      };
      actions.append(add);
    }
  }
  const cancel = node('button', command === 'pricing' ? 'Back' : 'Cancel');
  cancel.type = 'button';
  cancel.onclick = () => {
    if (back) back();
    else if (command === 'pricing' && operationCard.hidden) operation(command, definition, navButton);
    else document.querySelector('nav button[data-command="inventory"]')?.click();
  };
  if (back || !['inventory', 'orders', 'audit'].includes(command)) actions.append(cancel);
  form.replaceChildren(...controls.map(control => control.wrapper), actions);
  if (command === 'staff') {
    const guide = node('section');guide.className = 'role-access-guide';
    guide.append(node('h3','Role access'),node('p','Yes means the role can perform the action. Permissions are enforced by the backend.'));
    const definitions = [
      ['Browse inventory','inventory'],['Add, edit and archive products; upload images','product-content'],
      ['Edit available and reserved stock','stock-set'],['Run low-stock reports','reorder-report'],
      ['View selling price tiers','pricing'],['View and edit supplier costs','cost-set'],['Add, edit and remove price tiers','tier-set'],
      ['Review orders, payments, shipping and returns','commerce-data'],['View customer records with order information','commerce-data'],
      ['Manage customer accounts and purchasing permissions','customer-save'],['Issue customer sign-up invitations','customer-invite'],['Confirm delivery charges before payment','order-shipping'],['Create customer orders and reserve stock','order-create'],
      ['Cancel unpaid reserved orders and release stock','cancel'],['Record received payments','order-payment'],
      ['Prepare shipping, enter tracking and dispatch orders','fulfilment-save'],['Submit return requests','return-request'],
      ['Approve, reject and inspect returns; restock sellable goods','return-process'],['Record completed refunds','refund-record'],
      ['Create staff accounts and assign roles','staff'],['View the audit log','audit']
    ];
    const render = rows => {
      const wrap=node('div');wrap.className='role-access-table';const table=node('table');
      const roles=['sales','warehouse','finance','owner'];const header=table.createTHead().insertRow();
      header.append(node('th','Action'));roles.forEach(role=>header.append(node('th',role[0].toUpperCase()+role.slice(1))));
      const body=table.createTBody();
      for(const [title,permission] of rows) {
        const row=body.insertRow();row.append(node('th',title));
        roles.forEach(role=>row.append(node('td',(staffRolePermissions[role]||[]).includes(permission)?'Yes':'—')));
      }
      wrap.append(table);return wrap;
    };
    guide.append(render(definitions));
    const additional=node('details');additional.append(node('summary','Additional API and terminal permissions'));
    additional.append(node('p','These existing commands are not shown in the main web navigation.'));
    additional.append(render([
      ['Preview and import Excel workbooks','workbook-import'],['Import inventory CSV files','import'],
      ['Configure CCTV kit compatibility','compatibility'],['Create quotes and CCTV kit quotes','quote'],
      ['Reserve quoted stock','reserve'],['Record stock receipts','receive'],['Record legacy inspected returns','return']
    ]));guide.append(additional);
    form.append(guide);
  }

  const dismissSuggestions = command === 'inventory' ? inventorySuggestions(form, controls) : () => {};
  const hidePricingLookup = () => {
    controls[0].wrapper.hidden = true;
    submit.hidden = true;
    get('description').hidden = true;
  };
  if (command === 'pricing' && record) hidePricingLookup();
  let inventoryPosition = command === 'inventory' ? record : null;
  const filtersReady = command === 'inventory' ? api('operations/inventory-options', { values: [] })
    .then(({ brands, categories }) => {
      for (const [index, values] of [[1, brands], [2, categories]]) {
        controls[index].input.append(...values.map(value => new Option(value, value)));
      }
    }).catch(error => {
      if (submit.isConnected) message('status', error.message, true);
    }) : Promise.resolve();
  if (command === 'inventory' && record?.filters) {
    filtersReady.then(() => {
      if (!submit.isConnected) return;
      record.filters.forEach((value, index) => { controls[index].input.value = value; });
      form.requestSubmit();
    });
  }
  form.onsubmit = async event => {
    event.preventDefault();
    dismissSuggestions();
    if (['workbook-import', 'tier-remove', 'cancel', 'dispatch', 'return'].includes(command) &&
        !window.confirm(action + '?')) return;
    const values = [];
    let body = { values };
    for (const [index, definition] of definitions.entries()) {
      const input = controls[index].input;
      if (definition.type === 'file') {
        body = new FormData();
        body.append('file', input.files[0]);
      } else if (definition.type === 'password') {
        body.password = input.value;
        input.value = '';
      } else if (definition.type === 'checkbox') {
        if (input.checked) values.push(definition.flag);
      } else if (!input.value.trim() && definition.blank) {
        values.push(definition.blank);
      } else if (input.value.trim()) {
        const entries = definition.type === 'lines' ? input.value.split('\n').map(value => value.trim()).filter(Boolean)
          : [definition.type === 'money' ? String(Math.round(Number(input.value) * 100)) : input.value.trim()];
        for (const entry of entries) {
          if (definition.flag) values.push(definition.flag);
          values.push(entry);
        }
      }
    }
    submit.disabled = true;
    cancel.disabled = true;
    result.hidden = true;
    result.replaceChildren();
    message('status', 'Working…');
    try {
      const response = await api('operations/' + command, body);
      if (!submit.isConnected) return;
      if (back && ['cost-set', 'tier-set', 'tier-remove'].includes(command)) {
        back();
        return;
      }
      const editButton = allowedCommands.has('product-content') ? navButton : null;
      const pricingButton = allowedCommands.has('pricing') ? navButton : null;
      if (command === 'inventory') {
        const filters = controls.map(({ input }) => input.value);
        const openProduct = (next, nextDefinition, button, entry, page) => {
          const scrollTop = window.scrollY;
          const restore = () => operation(command, definition, navButton, { filters, page, scrollTop });
          operation(next, nextDefinition, button, entry, restore);
        };
        const position = inventoryPosition;
        inventoryPosition = null;
        renderInventory(response, result,
          editButton ? (entry, page) => openProduct('product', [], editButton, entry, page) : null,
          pricingButton ? (entry, page) => openProduct('pricing', pricingActions.pricing, pricingButton, entry, page) : null,
          position?.page,
          allowedCommands.has('stock-set') ? (entry, page, mode) => {
            const scrollTop = window.scrollY;
            void stockEditor(entry, mode, navButton,
              () => operation(command, definition, navButton, { filters, page, scrollTop }));
          } : null);
        if (position) requestAnimationFrame(() => {
          if (submit.isConnected) window.scrollTo(0, position.scrollTop);
        });
      } else if (command === 'pricing') {
        operationCard.hidden = true;
        result.classList.add('pricing-result');
        const restore = () => operation('pricing', definition, navButton, response.product, back);
        const tierButton = allowedCommands.has('tier-set') ? navButton : null;
        const costButton = allowedCommands.has('cost-set') ? navButton : null;
        renderPricing(response, result, cancel,
          tierButton ? (name,cents) => api('operations/tier-set',{values:[response.product.sku,name,String(cents)]}) : null,
          costButton ? () => operation('cost-set', pricingActions['cost-set'], costButton,
            { sku: response.product.sku, cents: response.cost_cents }, restore) : null,
          allowedCommands.has('tier-remove') ? name => api('operations/tier-remove',{values:[response.product.sku,name]}) : null);

      } else {
        showResult(response, result);
      }
      result.hidden = false;
      message('status', ['inventory', 'pricing'].includes(command) ? '' : 'Completed.');
    } catch (error) {
      if (submit.isConnected) message('status', error.message, true);
    } finally { submit.disabled = false; cancel.disabled = false; }
  };
  if (record && command === 'pricing') form.requestSubmit();
}

function session(user) {
  allowedCommands = new Set(user?.commands || []);
  get('login').hidden = Boolean(user);
  get('workspace').hidden = !user;
  get('logout').hidden = !user;
  get('identity').textContent = user ? user.user + ' · ' + user.role : '';
  staffRolePermissions = user?.rolePermissions || {};
  const navigation = get('navigation');
  navigation.replaceChildren();
  if (!user) return;
  for (const [group, operations] of Object.entries(groups)) {
    const details = node('details');
    details.open = true;
    details.append(node('summary', group));
    for (const [command, definition] of Object.entries(operations)) {
      if (!user.commands.includes(command)) continue;
      const button = node('button', definition[0]);
      button.dataset.command = command;
      button.addEventListener('click', () => {
        const restoreFocus = navigationToggle.getAttribute('aria-expanded') === 'true' &&
          navigationToggle.getClientRects().length > 0;
        operation(command, definition, button);
        if (restoreFocus) navigationToggle.focus();
      });
      details.append(button);
    }
    if (details.children.length > 1) navigation.append(details);
  }
  navigation.querySelector('button')?.click();
}

get('login-form').onsubmit = async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('button');
  submit.disabled = true;
  try {
    session(await api('login', Object.fromEntries(new FormData(form))));
    message('login-status', '');
  } catch (error) { message('login-status', error.message, true); }
  finally { form.elements.password.value = ''; submit.disabled = false; }
};
get('logout').onclick = async () => {
  try { await api('logout', {}); session(null); }
  catch (error) { message('status', error.message, true); }
};
api('session').then(session).catch(() => session(null));
