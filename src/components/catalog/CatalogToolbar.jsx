export default function CatalogToolbar({
  productCount,
  categories = [],
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="catalog-toolbar" aria-label="Ferramentas do catálogo">
      <label className="search-field">
        <span>Buscar</span>

        <input
          type="search"
          placeholder="Nome, código, cor, marca..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      <label>
        <span>Categoria</span>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Todas</option>

          {categories.map((item) => (
            <option
              key={item.slug}
              value={item.name}
            >
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Ordenar</span>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="featured">Destaques</option>
          <option value="recent">Mais recentes</option>
          <option value="lowest">Menor preço</option>
          <option value="highest">Maior preço</option>
        </select>
      </label>

      {/* <p className="product-count">{productCount} produtos encontrados</p> */}
    </div>
  );
}