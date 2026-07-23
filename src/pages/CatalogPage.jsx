import CatalogToolbar from "../components/catalog/CatalogToolbar.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import { useMemo, useState } from "react";
import listaProdutos from "../data/produtos.json";
import FavoritesWhatsAppFloat from "../components/favorites/FavoritesWhatsAppFloat.jsx";

const staticProducts = listaProdutos.products || [];
const staticCategories = listaProdutos.categories || [];

export default function CatalogPage() {
  const products = staticProducts;
  const categories = staticCategories;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("featured");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // BUSCA
    if (search.trim()) {
      const text = search.toLowerCase();

      result = result.filter((product) => {
        return [
          product.code,
          product.name,
          product.category,
          product.collection,
          product.brand,
          product.color,

          ...(product.tags || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(text);
      });
    }

    // CATEGORIA

    if (category) {
      result = result.filter((product) => product.category === category);
    }

    // ORDENAÇÃO

    switch (sort) {
      case "lowest":
        result.sort(
          (a, b) => (a.salePrice || a.price) - (b.salePrice || b.price),
        );

        break;

      case "highest":
        result.sort(
          (a, b) => (b.salePrice || b.price) - (a.salePrice || a.price),
        );

        break;

      case "recent":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        break;

      case "featured":

      default:
        result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return result;
  }, [products, search, category, sort]);

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h2>Todos os produtos</h2>
        </div>
        {/*<p>
          Busca, filtros e ordenação ja estão desenhados para receber a logica
          real.
        </p>*/}
      </div>

      <CatalogToolbar
        productCount={filteredProducts.length}
        categories={categories}
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
      />

      <ProductGrid products={filteredProducts} />

      <FavoritesWhatsAppFloat />
    </section>
  );
}
