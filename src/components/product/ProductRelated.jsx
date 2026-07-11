import ProductGrid from "./ProductGrid.jsx";
import { relatedProductsMap } from "../../data/relatedProducts.js";

export default function ProductRelated({ product, products }) {

  if (!product) return null;


  let related = [];


  // Primeiro tenta manual
  const manualCodes = relatedProductsMap[product.code];


  if (manualCodes) {
    related = products.filter((item) =>
      manualCodes.includes(item.code)
    );
  }


  // Caso não exista manual, usa algoritmo
  if (!related.length) {

    related = products
      .filter(item => item.code !== product.code)
      .map(item => {

        let score = 0;


        if (
          product.SubCategory &&
          item.SubCategory === product.SubCategory
        ) {
          score += 4;
        }


        if (
          item.category === product.category
        ) {
          score += 3;
        }


        if (
          product.collection &&
          item.collection === product.collection
        ) {
          score += 2;
        }


        return {
          ...item,
          score
        };

      })
      .filter(item => item.score > 0)
      .sort((a,b)=>b.score-a.score);

  }


  if (!related.length) return null;


  return (
    <section className="related-products">
      <h2>Produtos relacionados</h2>

      <ProductGrid products={related}/>
    </section>
  );
}