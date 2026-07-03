export function gerarLinkWhatsApp(product) {
  const telefone = import.meta.env.VITE_WHATSAPP_NUMBER;
  const preco = product.salePrice || product.price;

  const mensagem = `Olá!
Tenho interesse neste produto.
Código: ${product.code}
Produto: ${product.name}
Preço: R$ ${preco.toFixed(2).replace(".", ",")}

Pode me passar mais informações?`;

  return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
}

// NOVA FUNÇÃO PARA OS FAVORITOS
export function gerarLinkWhatsAppFavoritos(productsList) {
  const telefone = import.meta.env.VITE_WHATSAPP_NUMBER;

  // Mapeia cada produto para o formato "• CÓDIGO - Nome do Produto"
  const listaProdutos = productsList
    .map((prod) => `• ${prod.code} - ${prod.name}`)
    .join("\n");

  const mensagem = `Olá!

Gostaria de informações sobre estes produtos:

${listaProdutos}

Pode me informar disponibilidade?`;

  return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
}