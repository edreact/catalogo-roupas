import { Link } from 'react-router-dom';

export default function CategoryShowcase({ categories, collections }) {
  return (
    <section className="category-showcase">
      <div className="category-panel">
        <p className="eyebrow">Categorias</p>
        <h2>Encontre pelo tipo de peça</h2>
        <div className="category-list">
          {categories.map((category) => (
            <Link key={category.name} to={category.path}>
              <span>{category.name}</span>
              <small>{category.count} peças</small>
            </Link>
          ))}
        </div>
      </div>

      <div className="collection-panel">
        <p className="eyebrow">Coleções</p>
        <h2>Looks por momento</h2>
        <div className="collection-list">
          {collections.map((collection) => (
            <Link key={collection.name} to={collection.path}>
              {collection.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
