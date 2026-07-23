export default function ProductDetails({ product }) {
  const details = [
    { key: "Cor", value: product.color },
    { key: "Descrição", value: product.fullDescription },
    { key: "Marca", value: product.brand },
    { key: "Tamanho", value: product.size },
    { key: "Material", value: product.material },
    { key: "Medidas", value: product.measurements },
    { key: "Cuidados", value: product.care },
    { key: "Ocasião", value: product.occasion },
  ].filter((item) => item.value);

  if (!details.length) {
    return null;
  }

  return (
    <details className="product-details-dropdown">
      <summary>Ver detalhes do produto</summary>

      <div className="product-details">
        {details.map(({ key, value }) => (
          <p key={key}>
            <strong>{key}:</strong> {value}
          </p>
        ))}
      </div>
    </details>
  );
}
