# Contrato da API

Base URL:

```text
https://script.google.com/macros/s/SEU_ID/exec
```

## `GET /exec`

Retorna tudo que o site precisa para carregar a vitrine.

Resposta:

```json
{
  "success": true,
  "updatedAt": "2026-06-29T20:00:00.000Z",
  "products": [],
  "categories": [],
  "collections": [],
  "config": {},
  "banners": []
}
```

## `GET /exec?action=products`

Retorna produtos, categorias, colecoes, configuracoes e banners.

## `GET /exec?action=product&code=VF-2538`

Retorna um produto pelo codigo.

Tambem aceita slug:

```text
/exec?action=product&slug=vestido-floral-midi-vf-2538
```

Resposta:

```json
{
  "success": true,
  "updatedAt": "2026-06-29T20:00:00.000Z",
  "product": {
    "code": "VF-2538",
    "name": "Vestido floral midi",
    "slug": "vestido-floral-midi-vf-2538",
    "category": "Vestidos",
    "collection": "Verao",
    "price": 189.9,
    "salePrice": 159.9,
    "status": "Disponivel",
    "isAvailable": true,
    "images": [],
    "badges": ["Novidade", "Promocao"]
  }
}
```

## `GET /exec?action=categories`

Retorna categorias com quantidade de produtos ativos.

```json
{
  "success": true,
  "categories": [
    {
      "name": "Vestidos",
      "slug": "vestidos",
      "count": 12
    }
  ]
}
```

## `GET /exec?action=collections`

Retorna colecoes com quantidade de produtos ativos.

## `GET /exec?action=config`

Retorna configuracoes e banners.

## Campos principais de produto

```text
code
name
slug
category
subcategory
collection
brand
color
size
price
salePrice
isPromotion
isNew
isFeatured
isBestSeller
isLastPieces
isDealOfTheDay
shortDescription
fullDescription
material
quantity
images
video
status
isAvailable
createdAt
displayOrder
searchTags
occasion
care
measurements
active
badges
```

## Decisao tecnica

Nesta fase, a API retorna os dados principais de uma vez porque isso simplifica o Apps Script e deixa a navegacao do catalogo mais rapida apos o primeiro carregamento.

Quando o catalogo crescer muito, podemos evoluir para:

- paginacao por endpoint;
- filtros server-side;
- cache com `CacheService` do Apps Script;
- geracao automatica de sitemap com produtos reais.
