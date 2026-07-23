import BannerStrip from '../components/home/BannerStrip.jsx';
import CategoryShowcase from '../components/home/CategoryShowcase.jsx';
import Hero from '../components/home/Hero.jsx';
import SectionPreview from '../components/home/SectionPreview.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import listaProdutos from "../data/produtos.json";
import FavoritesWhatsAppFloat from '../components/favorites/FavoritesWhatsAppFloat.jsx';

export default function HomePage() {
  const products = listaProdutos.products || [];
  const featuredProducts = products
    .filter((product) => product.isFeatured || product.tags?.includes('destaque'))
    .slice(0, 3);
  const promotionalProducts = products
    .filter((product) => product.isPromotion || product.isNew || product.salePrice)
    .slice(0, 3);
  const sectionConfig = [
  {
    title: "Oferta do dia",
    description: "Descontos especiais por tempo limitado.",
    match: (p) => p.isDeal,
  },
  {
    title: "Produtos em destaque",
    description: "Peças selecionadas para aparecer primeiro na vitrine.",
    match: (p) => p.featured,
  },
  {
    title: "Novidades",
    description: "Confira as novidades.",
    match: (p) => p.isNew,
  },
  {
    title: "Mais vendidos",
    description: "Os queridinhos das clientes.",
    match: (p) => p.isBestSeller,
  },
  {
    title: "Últimas peças",
    description: "Aproveite antes que acabem.",
    match: (p) => p.isLastUnits,
  },
  {
    title: "Em promoção",
    description: "Preços promocionais para você.",
    match: (p) => p.isPromotion,
  },
];

const sections = sectionConfig
  .map((section) => ({
    ...section,
    products: products.filter(section.match),
  }))
  .filter((section) => section.products.length > 0);

  return (
    <>
      {/* <Hero /> */}
      {/*<BannerStrip />} */}

      {sections.map((section) => (
        <SectionPreview
          key={section.title}
          title={section.title}
          description={section.description}
        >
          <ProductGrid products={section.products} variant="preview-grid" />
        </SectionPreview>
      ))}

      {/*<CategoryShowcase categories={categories} collections={collections} />*/}

      {/*<SectionPreview
        title="Todos os produtos"
        //description="Produtos carregados da API publicada no banco de dados, com fallback local."
      >
        <ProductGrid products={products} />
      </SectionPreview>*/}
      
      <FavoritesWhatsAppFloat />
    </>
  );
}
