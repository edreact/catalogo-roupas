import {
  categoryHighlights,
  collectionHighlights,
  sampleProducts,
} from "../data/sampleCatalog.js";

const CACHE_KEY = "catalog-api-cache-v1";
const CACHE_TTL_MS = 1000 * 60 * 10; //Usar quando publicar site
//const CACHE_TTL_MS = 1000 * 30; // 30 segundos
//const CACHE_TTL_MS = 0; // usar apenas em produção//

const imageTones = ["rose", "sand", "wine", "denim", "ivory", "black"];

function getApiUrl() {
  return import.meta.env.VITE_CATALOG_API_URL || "";
}

export async function fetchCatalog() {
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    return buildFallbackCatalog("API ainda não configurada.");
  }

  const cachedCatalog = readCache();

  try {
    const response = await fetch(`${apiUrl}?t=${Date.now()}`);

    if (!response.ok) {
      throw new Error(`Erro ao carregar API: ${response.status}`);
    }

    const data = await response.json();

    const catalog = normalizeCatalog(data);

    writeCache(catalog);

    return catalog;
  } catch (error) {
    if (cachedCatalog) {
      return {
        ...cachedCatalog,
        source: "cache",
        error: error.message,
      };
    }

    return buildFallbackCatalog(error.message);
  }
}

function normalizeCatalog(data) {
  const products = (data.produtos || data.saida || [])
  .map(normalizeProduct)
  .filter((product) => product.active);
  return {
    products,
    categories: buildGroupsFromProducts(products, "category", "categoria"),
    collections: buildGroupsFromProducts(products, "collection", "colecao"),
    config: {},
    banners: [],
    updatedAt: new Date().toISOString(),
    source: "api",
    error: "",
  };
}

function normalizeProduct(product, index = 0) {
  return {
    code: product.Codigo || "",

    name: product.Nome || "Produto",

    slug: product.Slug || createSlug(`${product.Nome}-${product.Codigo}`),

    category: product.Categoria || "",

    collection: product.Colecao || "",

    brand: product.Marca || "",

    color: product.Cor || "",

    size: product.Tamanho || "",

    price: Number(product.Preco || 0),

    salePrice: product.Promocao ? Number(product.PrecoPromocional || 0) : null,

    status: product.Status || "Disponível",

    quantity: Number(product.Quantidade || 0),

    description: product.DescricaoCurta || product.DescricaoCompleta || "",

    fullDescription: product.DescricaoCompleta || "",

    material: product.Material || "",

    occasion: product.Ocasiao || "",

    measurements: product.Medidas || "",

    care: product.Cuidados || "",

    tags: product.TagsPesquisa
      ? product.TagsPesquisa.split(",").map((tag) => tag.trim())
      : [],

    featured: Boolean(product.Destaque),

    new: Boolean(product.Novidade),

    bestSeller: Boolean(product.MaisVendido),

    lastUnits: Boolean(product.UltimasPecas),

    deal: Boolean(product.OfertaDoDia),

    createdAt: product.DataCadastro,

    badges: [
      product.Novidade && "Novidade",
      product.Destaque && "Destaque",
      product.MaisVendido && "Mais vendido",
      product.UltimasPecas && "Últimas peças",
      product.OfertaDoDia && "Oferta do dia",
    ].filter(Boolean),

    images: Array.from({ length: 10 }, (_, i) => product[`Imagem${i + 1}`])
  .filter(Boolean),

    active:
      product.Ativo === true ||
      product.Ativo === "TRUE" ||
      product.Ativo === "true" ||
      product.Ativo === 1,

    imageTone: imageTones[index % imageTones.length],

    raw: product,
  };
}

function normalizeGroups(groups, type) {
  return (groups || []).map((group) => ({
    name: group.name,
    slug: group.slug || createSlug(group.name),
    path: `/${type}/${group.slug || createSlug(group.name)}`,
    count: group.count || 0,
  }));
}

function buildGroupsFromProducts(products, key, type) {
  const grouped = products.reduce((acc, product) => {
    const name = product[key];
    if (!name) return acc;

    acc[name] = acc[name] || 0;
    acc[name] += 1;
    return acc;
  }, {});

  return Object.keys(grouped).map((name) => ({
    name,
    slug: createSlug(name),
    path: `/${type}/${createSlug(name)}`,
    count: grouped[name],
  }));
}

function buildFallbackCatalog(error = "") {
  return {
    products: sampleProducts.map(normalizeProduct),
    categories: categoryHighlights,
    collections: collectionHighlights,
    config: {},
    banners: [],
    updatedAt: new Date().toISOString(),
    source: "fallback",
    error,
  };
}

function readCache() {
  try {
    const rawCache = window.localStorage.getItem(CACHE_KEY);
    if (!rawCache) return null;

    const cached = JSON.parse(rawCache);
    const isFresh = Date.now() - cached.cachedAt < CACHE_TTL_MS;

    return isFresh ? cached.catalog : null;
  } catch {
    return null;
  }
}

function writeCache(catalog) {
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        cachedAt: Date.now(),
        catalog,
      }),
    );
  } catch {
    // Cache is optional. If the browser blocks it, the catalog still works.
  }
}

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
