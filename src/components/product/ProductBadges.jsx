const badgeClassByName = {
  Novidade: "badge-new",
  Promocao: "badge-sale",
  "Mais Vendido": "badge-best",
  "Ultimas Pecas": "badge-last",
  "Oferta do Dia": "badge-offer",
  Vendido: "badge-sold",
};

export default function ProductBadges({
  badges = [],
  horizontal = false,
}) {
  if (!badges.length) return null;

  return (
    <div
      className={`product-badges ${horizontal ? "product-badges-horizontal" : ""}`}
      aria-label="Etiquetas do produto"
    >
      {badges.map((badge) => (
        <span
          key={badge}
          className={`product-badge ${badgeClassByName[badge] || ""}`}
        >
          {badge}
        </span>
      ))}
    </div>
  );
}