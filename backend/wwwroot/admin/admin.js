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
const groups = {
  Inventory: {
    inventory: ['Browse inventory', 'Search by SKU or product name and filter by brand or category.', [
      option('Search', '--search'), option('Brand', '--brand', 'select', { choices: [], all: 'All brands' }),
      option('Category', '--category', 'select', { choices: [], all: 'All categories' })
    ], 'Search'],
    product: ['Add, edit or archive product', 'Use the same SKU to edit a product. Clear Archived to restore it.', [
      sku, field('Product name'), field('Brand'), field('Category'),
      option('Product type', '--kind', 'select', { choices: ['other', 'camera', 'recorder', 'storage'] }),
      option('Recorder channels', '--channels', 'number', { min: 1 }), option('Archived', '--archived', 'checkbox')
    ], 'Save product'],
    receive: ['Adjust stock', 'Use a positive adjustment for receipts and a negative adjustment to remove units.', [
      sku, field('Quantity adjustment', 'number'), field('Reason')
    ], 'Record adjustment'],
    'reorder-report': ['Low-stock report', 'Find active products with available stock at or below the threshold.', [
      field('Threshold', 'number', { min: 1 }), field('Brand', 'text', { optional: true })
    ], 'Run report']
  },
  Pricing: {
    pricing: ['View product pricing', 'Review the workbook’s Price (S) and Price (P) tiers.', [sku], 'Find product'],
    'cost-set': ['Set product cost', 'Enter the supplier cost. Leave it blank to clear the cost.', [
      sku, field('Cost', 'money', { optional: true, blank: 'clear' })
    ], 'Save cost'],
    'tier-set': ['Set tier price', '', [sku, tier, field('Price', 'money')], 'Save tier'],
    'tier-remove': ['Remove tier price', 'The tier price will be unavailable for future quotes for this SKU.', [sku, tier], 'Remove tier']
  },
  'Quotes and orders': {
    orders: ['Browse orders', '', [], 'List orders'],
    order: ['Find an order', '', [order], 'View order'],
    compatibility: ['Set kit compatibility', '', [field('Recorder SKU'), field('Compatible camera or storage SKU')], 'Save compatibility'],
    quote: ['Create quote', '', [items, ...quoteOptions], 'Create quote'],
    kit: ['Create CCTV kit quote', '', [field('Recorder SKU'), items, ...quoteOptions], 'Create kit quote'],
    reserve: ['Reserve stock', '', [order], 'Reserve'],
    cancel: ['Cancel reservation', '', [order], 'Cancel reservation'],
    pay: ['Record test payment', 'Record a simulated payment reference for a reserved order.', [order, field('Payment reference')], 'Record payment'],
    dispatch: ['Dispatch order', '', [order, {
      ...option('Serial numbers (SKU=serial1,serial2, one SKU per line)', '--serial', 'lines')
    }], 'Dispatch'],
    return: ['Record return', '', [order, sku, field('Quantity', 'number', { min: 1 }), field('Inspection reason'),
      option('Serial number', '--serial'), option('Return to sellable stock', '--sellable', 'checkbox')
    ], 'Record return']
  },
  'Imports and access': {
    'workbook-preview': ['Preview workbook', '', [field('Excel workbook', 'file', { accept: '.xlsx' })], 'Preview'],
    'workbook-import': ['Import workbook', 'Apply product, tier price and stock changes from the workbook.', [field('Excel workbook', 'file', { accept: '.xlsx' })], 'Apply workbook'],
    import: ['Import inventory CSV', 'Add new SKUs from an inventory CSV.', [field('Inventory CSV', 'file', { accept: '.csv' })], 'Import CSV'],
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

function productThumbnail(sku) {
  const thumb = node('span');
  thumb.className = 'product-thumbnail';
  thumb.setAttribute('aria-hidden', 'true');
  thumbnailLookup ??= fetch('/admin/thumbnails.json')
    .then(response => response.ok ? response.json() : {})
    .catch(() => ({}));
  thumbnailLookup.then(images => {
    if (!Object.hasOwn(images, sku) || !thumb.isConnected) return;
    const image = node('img');
    image.alt = '';
    image.width = 40;
    image.height = 40;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => image.remove(), { once: true });
    image.src = '/admin/thumbnails/' + images[sku];
    thumb.append(image);
  });
  return thumb;
}

function renderInventory(records, target, onEdit, onPricing, page = 0) {
  if (!records.length) {
    target.append(node('p', 'No products match your search.'));
    return;
  }
  const pageSize = 50;
  page = Math.min(page, Math.ceil(records.length / pageSize) - 1);
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
      renderInventory(records, target, onEdit, onPricing, page + step);
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
    product.append(productThumbnail(record.sku), details);
    const stock = node('div');
    stock.append(node('strong', record.available + ' available'),
      node('p', record.reserved + ' reserved'));
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

function renderPricing(response, target, backButton, editTier, editCost) {
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
      const value = grouped.get(key);
      const amount = node('dd', valueText('cents', value));
      if (editTier) {
        const button = node('button', value == null ? 'Add' : 'Edit');
        button.setAttribute('aria-label', button.textContent + ' ' + heading + ' ' + name);
        button.addEventListener('click', () => editTier(key, value));
        amount.append(' ', button);
      }
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

function operation(command, definition, navButton, record, back) {
  const [title, description, definitions, action] = definition;
  document.querySelectorAll('nav button').forEach(button => button.removeAttribute('aria-current'));
  navButton.setAttribute('aria-current', 'page');
  get('navigation-current').textContent = navButton.textContent;
  setNavigationExpanded(false);
  get('operation').textContent = title;
  get('description').textContent = description;
  get('description').hidden = !description;
  const form = get('operation-form');
  const operationCard = form.closest('.card');
  operationCard.hidden = false;
  const result = get('result');
  result.hidden = true;
  result.classList.remove('pricing-result');
  result.replaceChildren();
  message('status', '');
  const controls = definitions.map(inputFor);
  if (command === 'product' && record) {
    const values = [record.sku, displayProductText(record.name), record.brand, record.category, record.kind, record.channels];
    values.forEach((value, index) => { controls[index].input.value = value ?? ''; });
    controls[6].input.checked = !record.active;
    controls[0].input.readOnly = true;
  }
  if (record && command === 'pricing') controls[0].input.value = record.sku;
  if (command === 'cost-set' && record) {
    controls[0].input.value = record.sku;
    controls[0].input.readOnly = true;
    if (record.cents != null) controls[1].input.value = (record.cents / 100).toFixed(2);
  }
  if (command === 'tier-set' && record) {
    controls[0].input.value = record.sku;
    controls[1].input.value = record.tier;
    if (record.cents != null) controls[2].input.value = (record.cents / 100).toFixed(2);
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
      const editButton = document.querySelector('nav button[data-command="product"]');
      const pricingButton = document.querySelector('nav button[data-command="pricing"]');
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
          editButton ? (entry, page) => openProduct('product', groups.Inventory.product, editButton, entry, page) : null,
          pricingButton ? (entry, page) => openProduct('pricing', groups.Pricing.pricing, pricingButton, entry, page) : null,
          position?.page);
        if (position) requestAnimationFrame(() => {
          if (submit.isConnected) window.scrollTo(0, position.scrollTop);
        });
      } else if (command === 'pricing') {
        operationCard.hidden = true;
        result.classList.add('pricing-result');
        const restore = () => operation('pricing', definition, navButton, response.product, back);
        const tierButton = document.querySelector('nav button[data-command="tier-set"]');
        const costButton = document.querySelector('nav button[data-command="cost-set"]');
        renderPricing(response, result, cancel,
          tierButton ? (name, cents) => operation('tier-set', groups.Pricing['tier-set'], tierButton,
            { sku: response.product.sku, tier: name, cents }, restore) : null,
          costButton ? () => operation('cost-set', groups.Pricing['cost-set'], costButton,
            { sku: response.product.sku, cents: response.cost_cents }, restore) : null);

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
  get('login').hidden = Boolean(user);
  get('workspace').hidden = !user;
  get('logout').hidden = !user;
  get('identity').textContent = user ? user.user + ' · ' + user.role : '';
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
