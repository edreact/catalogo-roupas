import staticCatalog from "../data/produtos.json";

export function getCatalog() {
  const products = staticCatalog.products || [];

  return {
    products,
    categories:
      staticCatalog.categories ||
      buildGroupsFromProducts(products, "category", "categoria"),
    collections:
      staticCatalog.collections ||
      buildGroupsFromProducts(products, "collection", "colecao"),
    config: staticCatalog.config || {},
    banners: staticCatalog.banners || [],
    updatedAt: staticCatalog.updatedAt || "",
    source: "static",
    error: "",
  };
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

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
