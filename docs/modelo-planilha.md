# Modelo da Planilha Google

Use uma Planilha Google com tres abas principais: `Produtos`, `Configuracoes` e `Banners`.

## Aba Produtos

Cabecalhos recomendados na primeira linha:

```text
Codigo
Nome
Categoria
Subcategoria
Colecao
Marca
Cor
Tamanho
Preco
PrecoPromocional
Promocao
Novidade
Destaque
MaisVendido
UltimasPecas
OfertaDoDia
DescricaoCurta
DescricaoCompleta
Material
Quantidade
Imagem1
Imagem2
Imagem3
Imagem4
Video
Status
DataCadastro
OrdemExibicao
TagsPesquisa
Slug
Ocasiao
Cuidados
Medidas
Ativo
```

## Exemplo de linha

```text
VF-2538
Vestido floral midi
Vestidos
Midi
Verao
Atelier Luz
Floral
M
189,90
159,90
SIM
SIM
SIM
NAO
NAO
NAO
Vestido leve e fluido.
Vestido midi floral com tecido leve, bom caimento e acabamento delicado.
Viscose
3
https://res.cloudinary.com/sua-conta/image/upload/vf-2538-1.jpg
https://res.cloudinary.com/sua-conta/image/upload/vf-2538-2.jpg



Disponivel
2026-06-29
1
vestido, floral, midi, verao
vestido-floral-midi-vf-2538
Dia a dia
Lavar a mao
Busto 90cm, cintura 74cm, comprimento 118cm
SIM
```

## Regras dos campos

- `Codigo`: obrigatorio e unico. Exemplo: `VF-2538`.
- `Nome`: nome comercial do produto.
- `Categoria`: grupo principal, como `Vestidos`, `Blusas`, `Jeans`.
- `Colecao`: grupo editorial, como `Verao`, `Festa`, `Casual`.
- `Preco` e `PrecoPromocional`: podem usar `189,90` ou `R$ 189,90`.
- Campos como `Promocao`, `Novidade`, `Destaque`: use `SIM` ou `NAO`.
- `Status`: use `Disponivel` ou `Vendido`.
- `Ativo`: use `SIM` para exibir ou `NAO` para ocultar.
- `Slug`: opcional. Se ficar vazio, a API gera automaticamente.
- `TagsPesquisa`: separe por virgula.
- `Imagem1` a `Imagem4`: URLs publicas das imagens, preferencialmente Cloudinary.

## Aba Configuracoes

Cabecalhos:

```text
Chave
Valor
Descricao
```

Exemplos:

```text
storeName | Catalogo Feminino | Nome exibido no site
whatsappNumber | 5565999999999 | Numero com codigo do pais e DDD
instagramUrl | https://instagram.com/sua-loja | Perfil do Instagram
catalogDescription | Moda feminina selecionada | Descricao para SEO
```

## Aba Banners

Cabecalhos:

```text
Titulo
Subtitulo
Imagem
Link
Ordem
Ativo
```

Exemplo:

```text
Novidades da semana
Pecas leves para renovar o guarda-roupa
https://res.cloudinary.com/sua-conta/image/upload/banner-verao.jpg
/colecao/verao
1
SIM
```

## Observacoes sobre imagens

Recomendacao: usar Cloudinary para hospedar imagens.

Motivos:

- entrega mais rapida;
- URLs estaveis;
- redimensionamento e compressao por CDN;
- melhor resultado no celular;
- mais adequado para catalogo visual.

Google Drive pode funcionar no inicio, mas tende a causar problemas com permissao, performance e estabilidade dos links.
