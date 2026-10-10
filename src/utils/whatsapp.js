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
    .map((prod) => {
      const url = new URL(
        `/produto/${encodeURIComponent(prod.slug || prod.code)}`,
        window.location.origin,
      );
      url.searchParams.set("img", prod.img || 1);

      return `• ${prod.name} - Código: ${prod.code}\n  ${url.toString()}`;
    })
    .join("\n");

  const mensagem = `Olá!

Gostaria de informações sobre estes produtos:

${listaProdutos}

Pode me informar disponibilidade?`;

  return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
}

// COMPARTILHAR PRODUTO

export function compartilharProdutoWhatsApp(product, currentImage = 0) {
  const url = new URL(window.location.href);

  url.searchParams.set("img", currentImage + 1);

  const shareUrl = url.toString();

  const mensagem = `Olha o que eu encontrei!
${product.name} no Catálogo Feminino. Entra aqui: ${shareUrl}`;

  const link = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;

  window.open(link, "_blank", "noopener,noreferrer");
}
