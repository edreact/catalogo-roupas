import BannerStrip from '../components/home/BannerStrip.jsx';
import CategoryShowcase from '../components/home/CategoryShowcase.jsx';
import Hero from '../components/home/Hero.jsx';
import SectionPreview from '../components/home/SectionPreview.jsx';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import useCatalog from '../hooks/useCatalog.js';
import FavoritesWhatsAppFloat from '../components/favorites/FavoritesWhatsAppFloat.jsx';

export default function HomePage() {
  const { products, categories, collections, isLoading, source, error } = useCatalog();
  const featuredProducts = products
    .filter((product) => product.isFeatured || product.tags?.includes('destaque'))
    .slice(0, 3);
  const promotionalProducts = products
    .filter((product) => product.isPromotion || product.isNew || product.salePrice)
    .slice(0, 3);
  const sections = [
    {
      title: 'Produtos em destaque',
      description: 'Peças selecionadas para aparecer primeiro na vitrine.',
      products: featuredProducts.length ? featuredProducts : products.slice(0, 3),
    },
    {
      title: 'Novidades e promoções',
      description: 'Produtos marcados como novidade, promoção ou oferta do dia.',
      products: promotionalProducts.length ? promotionalProducts : products.slice(0, 3),
    },
  ];

  return (
    <>
      <Hero />
      <BannerStrip />
      <DataNotice source={source} error={error} />

      {sections.map((section) => (
        <SectionPreview
          key={section.title}
          title={section.title}
          description={section.description}
        >
          {isLoading ? <LoadingGrid /> : <ProductGrid products={section.products} variant="preview-grid" />}
        </SectionPreview>
      ))}

      <CategoryShowcase categories={categories} collections={collections} />

      <SectionPreview
        title="Todos os produtos"
        description="Produtos carregados da API publicada no banco de dados, com fallback local."
      >
        {isLoading ? <LoadingGrid count={4} /> : <ProductGrid products={products} />}
        <FavoritesWhatsAppFloat />
      </SectionPreview>
    </>
  );
}

function LoadingGrid({ count = 3 }) {
  return (
    <div className="product-grid preview-grid">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

function DataNotice({ source, error }) {
  if (source === 'api' || source === 'loading') return null;

  return (
    <div className="data-notice">
      <strong>{source === 'cache' ? 'Usando cache local' : 'Usando dados demonstrativos'}</strong>
      {error && <span>{error}</span>}
    </div>
  );
}
