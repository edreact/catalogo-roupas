import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, variant = '' }) {
  if (!products.length) {
    return (
      <div className="empty-inline">
        <strong>Nenhum produto encontrado</strong>
        <p>Quando houver mais estoques eles aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className={`product-grid ${variant}`}>
      {products.map((product) => (
        <ProductCard key={product.code} product={product} />
      ))}
    </div>
  );
}
