# Conectar o frontend a API

Depois de publicar o Google Apps Script, copie a URL terminada em `/exec`.

## Ambiente local

Crie um arquivo `.env.local` na raiz do projeto:

```text
VITE_CATALOG_API_URL=https://script.google.com/macros/s/SEU_ID/exec
```

Depois rode o site novamente.

## Netlify

No painel do Netlify:

1. Abra o site.
2. Entre em `Site configuration`.
3. Acesse `Environment variables`.
4. Crie a variavel `VITE_CATALOG_API_URL`.
5. Cole a URL publicada do Apps Script.
6. Publique um novo deploy.

## Comportamento esperado

- Com URL configurada: o site carrega dados da planilha.
- Com API temporariamente indisponivel: o site tenta usar cache local por ate 10 minutos.
- Sem URL configurada: o site usa dados demonstrativos para continuar navegavel.

## Arquivos envolvidos

- `src/services/catalogApi.js`: busca dados, normaliza resposta, usa cache e fallback.
- `src/hooks/useCatalog.js`: entrega produtos, categorias, colecoes e estados de carregamento.
- `src/pages/HomePage.jsx`: home conectada ao catalogo.
- `src/pages/CatalogPage.jsx`: grade conectada ao catalogo.
- `src/pages/ProductPage.jsx`: detalhe conectado ao catalogo.
