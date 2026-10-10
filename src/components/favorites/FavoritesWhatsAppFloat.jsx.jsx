import { useFavorites } from "../../context/FavoritesContext.jsx";
import useCatalog from "../../hooks/useCatalog.js";
import { gerarLinkWhatsAppFavoritos } from "../../utils/whatsapp.js";
import { FaWhatsapp } from "react-icons/fa";

export default function FavoritesWhatsAppFloat() {
  const { favorites } = useFavorites();
  const { products } = useCatalog();

  const favoriteProducts = favorites.flatMap((favorite) => {
    const product = products.find(
      (item) => String(item.code) === favorite.code,
    );

    return product ? [{ ...product, img: favorite.img }] : [];
  });

  if (favoriteProducts.length === 0) return null;

  const link = gerarLinkWhatsAppFavoritos(favoriteProducts);

  return (
    <a
  href={link}
  target="_blank"
  rel="noopener noreferrer"
  className="whatsapp-float-button"
  data-tooltip={buildTooltip(favoriteProducts)}
>
  <FaWhatsapp className="whatsapp-icon" />
  Enviar seleção ({favoriteProducts.length})
</a>
  );
}

function buildTooltip(products) {
  const max = 4;

  const list = products.slice(0, max).map((p) => {
    return `• ${p.code} - ${p.name}`;
  });

  if (products.length > max) {
    list.push(`• +${products.length - max} itens...`);
  }

  return list.join("\n");
}