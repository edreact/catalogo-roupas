import { FaWhatsapp } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { FiShoppingBag } from "react-icons/fi";

export default function BannerStrip() {
  return (
    <section className="banner-strip" aria-label="Como comprar">
      <div className="banner-item">
        <span className="banner-title">
          <FiShoppingBag className="banner-icon" />
          Explore o catálogo
        </span>
        <strong>Veja as fotos, preços e detalhes das peças.</strong>
      </div>

      <div className="banner-item">
        <span className="banner-title">
          <FiHeart className="banner-icon" />
          Monte sua seleção
        </span>
        <strong>Salve os produtos que você mais gostar.</strong>
      </div>

      <div className="banner-item">
        <span className="banner-title">
          <FaWhatsapp className="banner-icon banner-whatsapp-icon" />
          Envie pelo WhatsApp
        </span>
        <strong>
          Sua seleção será enviada junto com os códigos dos produtos.
        </strong>
      </div>
    </section>
  );
}