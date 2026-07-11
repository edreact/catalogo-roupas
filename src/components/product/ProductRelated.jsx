import ProductGrid from "./ProductGrid.jsx";

export default function ProductRelated({ product, products }) {
  if (!product) return null;

  const scoreProduct = (p) => {
    let points = 0;

    // Mesma subcategoria
    if (
      product.SubCategory &&
      p.SubCategory === product.SubCategory
    ) {
      points += 4;
    }

    // Mesma categoria
    if (p.category === product.category) {
      points += 3;
    }

    // Mesma coleção
    if (
      product.collection &&
      p.collection === product.collection
    ) {
      points += 2;
    }

    // Tags em comum (+2 por tag)
    if (
      Array.isArray(product.tags) &&
      Array.isArray(p.tags)
    ) {
      const commonTags = p.tags.filter((tag) =>
        product.tags.includes(tag)
      ).length;

      points += commonTags * 2;
    }

    // Produto em destaque
    if (p.featured) {
      points += 1;
    }

    return points;
  };

  const relatedProducts = products
    .filter((item) => item.code !== product.code)
    .map((item) => ({
      ...item,
      score: scoreProduct(item),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ score, ...item }) => item);

  if (!relatedProducts.length) return null;

  return (
    <section className="related-products">
      <h2>Produtos relacionados</h2>

      <div className="product-related">
        <ProductGrid products={relatedProducts} />
      </div>
    </section>
  );
}