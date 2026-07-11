import ProductGrid from "./ProductGrid.jsx";

export default function ProductRelated({ product, products }) {
  if (!product) return null;

  const relatedProducts = products
    .filter((item) => item.code !== product.code)
    .sort((a, b) => {
      const score = (p) => {
        let points = 0;

        if (
          product.SubCategory &&
          p.SubCategory === product.SubCategory
        ) {
          points += 4;
        }

        if (p.category === product.category) {
          points += 3;
        }

        if (
          product.collection &&
          p.collection === product.collection
        ) {
          points += 2;
        }

        if (p.featured) {
          points += 1;
        }

        return points;
      };

      return score(b) - score(a);
    })
    .slice(0, 4);

  if (!relatedProducts.length) return null;

  return (
    <section className="related-products">
      <h2>Você também pode gostar</h2>

      <ProductGrid products={relatedProducts} />
    </section>
  );
}