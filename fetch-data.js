import axios from "axios";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, "src", "data", "produtos.json");

const imageTones = ["rose", "sand", "wine", "denim", "ivory", "black"];

await loadLocalEnv();

const sourceUrl =
  process.env.CATALOG_CSV_URL ||
  process.env.GOOGLE_SHEETS_CSV_URL ||
  process.env.VITE_CATALOG_CSV_URL ||
  process.env.CATALOG_API_URL ||
  process.env.VITE_CATALOG_API_URL ||
  "";

if (!sourceUrl) {
  throw new Error(
    "Configure CATALOG_CSV_URL, GOOGLE_SHEETS_CSV_URL, VITE_CATALOG_CSV_URL, CATALOG_API_URL ou VITE_CATALOG_API_URL no ambiente do build.",
  );
}

const response = await axios.get(sourceUrl, {
  responseType: "text",
  transformResponse: [(data) => data],
  headers: {
    Accept: "text/csv, application/json;q=0.9, */*;q=0.8",
  },
});

const rows = parsePayload(response.data);
const products = rows.map(normalizeProduct).filter((product) => product.active);

const catalog = {
  products,
  productsRaw: products.map((product) => product.raw),
  categories: buildGroupsFromProducts(products, "category", "categoria"),
  collections: buildGroupsFromProducts(products, "collection", "colecao"),
  config: {},
  banners: [],
  updatedAt: new Date().toISOString(),
  source: "static",
  error: "",
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

console.log(`Catalogo estatico gerado em ${path.relative(__dirname, outputPath)}.`);
console.log(`${products.length} produtos ativos gravados.`);

async function loadLocalEnv() {
  try {
    const envFile = await readFile(path.join(__dirname, ".env"), "utf8");

    envFile
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .forEach((line) => {
        const [key, ...valueParts] = line.split("=");

        if (!process.env[key]) {
          process.env[key] = valueParts.join("=").trim().replace(/^"|"$/g, "");
        }
      });
  } catch {
    // Netlify provides environment variables directly during build.
  }
}

function parsePayload(payload) {
  const text = String(payload || "").trim();

  if (!text) {
    return [];
  }

  const json = tryParseJson(text);
  if (json) {
    return json.produtos || json.saida || json.productsRaw || json.products || [];
  }

  return parseCsv(text).map(normalizeCsvRow);
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let field = "";
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      field += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }

      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field);
  rows.push(row);

  const [headers = [], ...dataRows] = rows.filter((items) =>
    items.some((item) => item.trim() !== ""),
  );

  return dataRows.map((items) =>
    headers.reduce((acc, header, index) => {
      acc[header.trim()] = items[index] ?? "";
      return acc;
    }, {}),
  );
}

function normalizeCsvRow(row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, parseCellValue(value)]),
  );
}

function parseCellValue(value) {
  const trimmed = String(value ?? "").trim();
  const normalized = trimmed.toLowerCase();

  if (["true", "verdadeiro", "sim", "1"].includes(normalized)) return true;
  if (["false", "falso", "nao", "não", "0"].includes(normalized)) return false;

  return trimmed;
}

function normalizeProduct(product, index = 0) {
  const code = product.Codigo || product.code || "";

  return {
    code,
    name: product.Nome || product.name || "Produto",
    slug: String(product.Slug || product.slug || code),
    category: product.Categoria || product.category || "",
    subCategory: product.subCategoria || product.SubCategoria || product.subCategory || "",
    collection: product.Colecao || product.collection || "",
    brand: product.Marca || product.brand || "",
    color: product.Cor || product.color || "",
    size: product.Tamanho || product.size || "",
    price: Number(product.Preco || product.price || 0),
    salePrice: product.Promocao
      ? Number(product.PrecoPromocional || product.salePrice || 0)
      : product.salePrice || null,
    status: product.Status || product.status || "Disponivel",
    quantity: Number(product.Quantidade || product.quantity || 0),
    description:
      product.DescricaoCurta || product.DescricaoCompleta || product.description || "",
    fullDescription:
      product.DescricaoCompleta || product.fullDescription || product.description || "",
    material: product.Material || product.material || "",
    occasion: product.Ocasiao || product.occasion || "",
    related: product.Relacionados || product.related || "",
    measurements: product.Medidas || product.measurements || "",
    care: product.Cuidados || product.care || "",
    tags: product.TagsPesquisa
      ? String(product.TagsPesquisa)
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
      : product.tags || [],
    featured: Boolean(product.Destaque || product.featured),
    isNew: Boolean(product.Novidade || product.isNew),
    isBestSeller: Boolean(product.MaisVendido || product.isBestSeller),
    isLastUnits: Boolean(product.UltimasPecas || product.isLastUnits),
    isDeal: Boolean(product.OfertaDoDia || product.isDeal),
    createdAt: product.DataCadastro || product.createdAt || "",
    isPromotion: Boolean(product.Promocao || product.isPromotion),
    badges: [
      (product.Novidade || product.isNew) && "Novidade",
      (product.Destaque || product.featured) && "Destaque",
      (product.MaisVendido || product.isBestSeller) && "Mais vendido",
      (product.UltimasPecas || product.isLastUnits) && "Ultimas pecas",
      (product.OfertaDoDia || product.isDeal) && "Oferta do dia",
    ].filter(Boolean),
    images:
      product.images ||
      Array.from({ length: 10 }, (_, i) => product[`Imagem${i + 1}`]).filter(
        Boolean,
      ),
    active:
      product.Ativo === true ||
      product.Ativo === "TRUE" ||
      product.Ativo === "true" ||
      product.Ativo === 1 ||
      product.active === true,
    imageTone: product.imageTone || imageTones[index % imageTones.length],
    raw: toRawProduct(product),
  };
}

function toRawProduct(product) {
  if (product.raw) return product.raw;

  return {
    ...product,
    Codigo: product.Codigo || product.code || "",
    Nome: product.Nome || product.name || "",
    Categoria: product.Categoria || product.category || "",
    Colecao: product.Colecao || product.collection || "",
    Marca: product.Marca || product.brand || "",
    Cor: product.Cor || product.color || "",
    Tamanho: product.Tamanho || product.size || "",
    Preco: product.Preco || product.price || "",
    PrecoPromocional: product.PrecoPromocional || product.salePrice || "",
    Status: product.Status || product.status || "",
    Quantidade: product.Quantidade || product.quantity || "",
    DescricaoCurta: product.DescricaoCurta || product.description || "",
    DescricaoCompleta: product.DescricaoCompleta || product.fullDescription || "",
    Material: product.Material || product.material || "",
    Ocasiao: product.Ocasiao || product.occasion || "",
    Relacionados: product.Relacionados || product.related || "",
    Medidas: product.Medidas || product.measurements || "",
    Cuidados: product.Cuidados || product.care || "",
    TagsPesquisa: product.TagsPesquisa || (product.tags || []).join(","),
    Destaque: product.Destaque ?? product.featured ?? false,
    Novidade: product.Novidade ?? product.isNew ?? false,
    MaisVendido: product.MaisVendido ?? product.isBestSeller ?? false,
    UltimasPecas: product.UltimasPecas ?? product.isLastUnits ?? false,
    OfertaDoDia: product.OfertaDoDia ?? product.isDeal ?? false,
    Promocao: product.Promocao ?? product.isPromotion ?? false,
    DataCadastro: product.DataCadastro || product.createdAt || "",
    Ativo: product.Ativo ?? product.active ?? true,
    ...Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => {
        const key = `Imagem${i + 1}`;
        return [key, product[key] || product.images?.[i] || ""];
      }),
    ),
  };
}

function buildGroupsFromProducts(productsList, key, type) {
  const grouped = productsList.reduce((acc, product) => {
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

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
