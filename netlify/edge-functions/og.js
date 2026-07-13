export default async (request, context) => {

  const url = new URL(request.url);

  // Executa somente nas páginas de produto
  const match = url.pathname.match(/^\/produto\/([^/]+)/);

  if (!match) {
    return context.next();
  }

  const userAgent =
    request.headers.get("user-agent") || "";

  // Bots que geram preview
  const BOT_REGEX =
    /(facebookexternalhit|Facebot|WhatsApp|Twitterbot|TelegramBot|Slackbot|Discordbot|LinkedInBot|Googlebot|SkypeUriPreview|Pinterest|Applebot)/i;

  const isBot = BOT_REGEX.test(userAgent);

  // Usuário normal continua usando o React normalmente
  if (!isBot) {
    return context.next();
  }

  const id = decodeURIComponent(match[1]);

  const api =
    Deno.env.get("CATALOG_API_URL");

  if (!api) {

    console.error(
      "CATALOG_API_URL não configurada."
    );

    return context.next();

  }

  try {

    const response = await fetch(
      `${api}?codigo=${encodeURIComponent(id)}`,
      {
        headers: {
          Accept: "application/json"
        }
      }
    );

    if (!response.ok) {

      console.error(
        "Erro ao consultar a API."
      );

      return context.next();

    }

    const data = await response.json();

    const product = data.produto;

    if (!product) {
      return context.next();
    }

    const title =
      escapeHtml(product.Nome || "");

    const description =
      escapeHtml(
        product.DescricaoCurta ||
        product.DescricaoCompleta ||
        ""
      );

    const image =
      product.Imagem1 || "";

    const pageUrl =
      url.href;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>

<meta charset="utf-8">

<title>${title}</title>

<meta name="description"
content="${description}">

<meta property="og:type"
content="product">

<meta property="og:title"
content="${title}">

<meta property="og:description"
content="${description}">

<meta property="og:image"
content="${image}">

<meta property="og:url"
content="${pageUrl}">

<meta property="og:site_name"
content="Catálogo Feminino">

<meta property="og:locale"
content="pt_BR">

<meta name="twitter:card"
content="summary_large_image">

<meta name="twitter:title"
content="${title}">

<meta name="twitter:description"
content="${description}">

<meta name="twitter:image"
content="${image}">

</head>

<body>

<h1>${title}</h1>

<p>${description}</p>

</body>

</html>`;

    return new Response(
      html,
      {

        status: 200,

        headers: {

          "Content-Type":
            "text/html; charset=UTF-8",

          "Cache-Control":
            "public, max-age=600, s-maxage=3600"

        }

      }
    );

  }

  catch (err) {

    console.error(err);

    return context.next();

  }

};

function escapeHtml(text = "") {

  return String(text)

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#39;");

}