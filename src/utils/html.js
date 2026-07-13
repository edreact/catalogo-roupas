function escapeHtml(text = "") {

    return String(text)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}

export function buildHtml(product, pageUrl) {

    const siteName =
        Netlify.env.get("SITE_NAME") ||
        "Catálogo Feminino";

    const title =
        product.Nome ||
        "Produto";

    const description =
        product.DescricaoCurta ||
        "";

    const image =
        product.Imagem1 ||
        "";

    return `<!DOCTYPE html>

<html lang="pt-BR">

<head>

<meta charset="utf-8">

<title>${escapeHtml(title)}</title>

<meta property="og:type" content="product">

<meta property="og:title" content="${escapeHtml(title)}">

<meta property="og:description" content="${escapeHtml(description)}">

<meta property="og:image" content="${image}">

<meta property="og:url" content="${pageUrl}">

<meta property="og:site_name" content="${escapeHtml(siteName)}">

<meta name="twitter:card" content="summary_large_image">

<meta name="twitter:title" content="${escapeHtml(title)}">

<meta name="twitter:description" content="${escapeHtml(description)}">

<meta name="twitter:image" content="${image}">

</head>

<body>

${escapeHtml(title)}

</body>

</html>`;

}