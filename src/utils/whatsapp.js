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

// FAVORITOS

export function gerarLinkWhatsAppFavoritos(productsList) {
  const telefone = import.meta.env.VITE_WHATSAPP_NUMBER;

  const listaProdutos = productsList
    .map((prod) => `• ${prod.code} - ${prod.name}`)
    .join("\n");

  const mensagem = `Olá!

Gostaria de informações sobre estes produtos:

${listaProdutos}

Pode me informar disponibilidade?`;

  return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
}

// COMPARTILHAR PRODUTO

export function compartilharProdutoWhatsApp(product) {
  const url = window.location.href;

  const mensagem = `Olha o que eu encontrei!
${product.name} no Catálogo Feminino. Entra aqui: ${url}`;

  const link = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;

  window.open(link, "_blank", "noopener,noreferrer");
}
