const SHEET_NAMES = {
  products: 'Produtos',
  settings: 'Configuracoes',
  banners: 'Banners',
};

const DEFAULT_ACTION = 'products';

function doGet(event) {
  try {
    const params = event && event.parameter ? event.parameter : {};
    const action = String(params.action || DEFAULT_ACTION).toLowerCase();
    const payload = buildPayload(action, params);

    return jsonResponse({
      success: true,
      updatedAt: new Date().toISOString(),
      ...payload,
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      updatedAt: new Date().toISOString(),
      error: error.message,
    });
  }
}

function buildPayload(action, params) {
  const products = getProducts();

  if (action === 'product') {
    const code = normalizeText(params.code);
    const slug = normalizeText(params.slug);
    const product = products.find((item) => {
      return normalizeText(item.code) === code || normalizeText(item.slug) === slug;
    });

    return { product: product || null };
  }

  if (action === 'categories') {
    return { categories: getCategories(products) };
  }

  if (action === 'collections') {
    return { collections: getCollections(products) };
  }

  if (action === 'config') {
    return { config: getSettings(), banners: getBanners() };
  }

  return {
    products,
    categories: getCategories(products),
    collections: getCollections(products),
    config: getSettings(),
    banners: getBanners(),
  };
}

function getProducts() {
  const rows = readSheet(SHEET_NAMES.products);

  return rows
    .map(mapProduct)
    .filter((product) => product.active)
    .sort((first, second) => {
      const firstOrder = Number(first.displayOrder || 999999);
      const secondOrder = Number(second.displayOrder || 999999);

      if (firstOrder !== secondOrder) return firstOrder - secondOrder;
      return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
    });
}

function mapProduct(row) {
  const code = String(row.Codigo || '').trim();
  const name = String(row.Nome || '').trim();
  const slug = String(row.Slug || createSlug(`${name}-${code}`)).trim();
  const status = String(row.Status || 'Disponivel').trim();
  const quantity = toNumber(row.Quantidade);
  const isPromotion = toBoolean(row.Promocao);
  const isNew = toBoolean(row.Novidade);
  const isFeatured = toBoolean(row.Destaque);
  const isBestSeller = toBoolean(row.MaisVendido);
  const isLastPieces = toBoolean(row.UltimasPecas);
  const isDealOfTheDay = toBoolean(row.OfertaDoDia);
  const images = [
    row.Imagem1,
    row.Imagem2,
    row.Imagem3,
    row.Imagem4,
  ]
    .map((image) => String(image || '').trim())
    .filter(Boolean);

  return {
    code,
    name,
    slug,
    category: String(row.Categoria || '').trim(),
    subcategory: String(row.Subcategoria || '').trim(),
    collection: String(row.Colecao || '').trim(),
    brand: String(row.Marca || '').trim(),
    color: String(row.Cor || '').trim(),
    size: String(row.Tamanho || '').trim(),
    price: toNumber(row.Preco),
    salePrice: toNumber(row.PrecoPromocional),
    isPromotion,
    isNew,
    isFeatured,
    isBestSeller,
    isLastPieces,
    isDealOfTheDay,
    shortDescription: String(row.DescricaoCurta || '').trim(),
    fullDescription: String(row.DescricaoCompleta || '').trim(),
    material: String(row.Material || '').trim(),
    quantity,
    images,
    video: String(row.Video || '').trim(),
    status,
    isAvailable: normalizeText(status) === 'disponivel' && quantity !== 0,
    createdAt: formatDate(row.DataCadastro),
    displayOrder: toNumber(row.OrdemExibicao),
    searchTags: splitList(row.TagsPesquisa),
    occasion: String(row.Ocasiao || '').trim(),
    care: String(row.Cuidados || '').trim(),
    measurements: String(row.Medidas || '').trim(),
    active: row.Ativo === undefined || row.Ativo === '' ? true : toBoolean(row.Ativo),
    badges: buildBadges({
      status,
      isNew,
      isPromotion,
      isBestSeller,
      isLastPieces,
      isDealOfTheDay,
    }),
  };
}

function buildBadges(flags) {
  const badges = [];

  if (normalizeText(flags.status) === 'vendido') badges.push('Vendido');
  if (flags.isNew) badges.push('Novidade');
  if (flags.isPromotion) badges.push('Promocao');
  if (flags.isBestSeller) badges.push('Mais Vendido');
  if (flags.isLastPieces) badges.push('Ultimas Pecas');
  if (flags.isDealOfTheDay) badges.push('Oferta do Dia');

  return badges;
}

function getCategories(products) {
  return groupProducts(products, 'category').map((item) => ({
    name: item.name,
    slug: createSlug(item.name),
    count: item.count,
  }));
}

function getCollections(products) {
  return groupProducts(products, 'collection').map((item) => ({
    name: item.name,
    slug: createSlug(item.name),
    count: item.count,
  }));
}

function groupProducts(products, key) {
  const grouped = products.reduce((acc, product) => {
    const name = product[key];
    if (!name) return acc;

    acc[name] = acc[name] || 0;
    acc[name] += 1;
    return acc;
  }, {});

  return Object.keys(grouped)
    .sort((first, second) => first.localeCompare(second, 'pt-BR'))
    .map((name) => ({ name, count: grouped[name] }));
}

function getSettings() {
  const rows = readSheet(SHEET_NAMES.settings);

  return rows.reduce((config, row) => {
    const key = String(row.Chave || '').trim();
    if (!key) return config;

    config[key] = row.Valor;
    return config;
  }, {});
}

function getBanners() {
  return readSheet(SHEET_NAMES.banners)
    .filter((row) => row.Ativo === undefined || row.Ativo === '' || toBoolean(row.Ativo))
    .map((row) => ({
      title: String(row.Titulo || '').trim(),
      subtitle: String(row.Subtitulo || '').trim(),
      image: String(row.Imagem || '').trim(),
      link: String(row.Link || '').trim(),
      order: toNumber(row.Ordem),
    }))
    .sort((first, second) => Number(first.order || 999999) - Number(second.order || 999999));
}

function readSheet(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(normalizeHeader);

  return values.slice(1).map((row) => {
    return headers.reduce((record, header, index) => {
      if (!header) return record;
      record[header] = row[index];
      return record;
    }, {});
  });
}

function normalizeHeader(header) {
  return String(header || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '');
}

function toBoolean(value) {
  const normalized = normalizeText(value);
  return ['sim', 's', 'true', '1', 'yes', 'x'].includes(normalized);
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return value;

  const normalized = String(value)
    .replace(/\s/g, '')
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.');
  const number = Number(normalized);

  return Number.isFinite(number) ? number : null;
}

function splitList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return value.toISOString();
  }

  return String(value).trim();
}

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function createSlug(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
