export default function ProductCardSkeleton() {
  return (
    <article className="product-card product-card-placeholder" aria-label="Produto em carregamento">
      <div className="product-image-placeholder" />
      <div className="product-copy-placeholder wide" />
      <div className="product-copy-placeholder narrow" />
    </article>
  );
}
