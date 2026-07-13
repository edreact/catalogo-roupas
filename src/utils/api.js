export async function getProduct(codigo) {

    const apiUrl = Netlify.env.get("CATALOG_API_URL");

    if (!apiUrl) {
        throw new Error(
            "Variável CATALOG_API_URL não encontrada."
        );
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error(
            "Erro ao consultar API."
        );
    }

    const data = await response.json();

    const produtos = data.produtos || [];

    return produtos.find((item) => {

        return (
            String(item.Codigo) === String(codigo)
            ||
            String(item.codigo) === String(codigo)
        );

    });

}