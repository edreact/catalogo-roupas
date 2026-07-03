export function formatCurrency(value) {
  if (value === null || value === undefined) return '';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function getProductPrice(product) {
  return product.salePrice || product.price;
}
