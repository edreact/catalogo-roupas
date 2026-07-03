# Publicacao da API no Google Apps Script

Este guia cria uma API publica somente leitura para o catalogo. A planilha continua privada; o site acessa apenas o JSON liberado pelo Apps Script.

## 1. Criar a planilha

Crie uma Planilha Google com as abas:

- `Produtos`
- `Configuracoes`
- `Banners`

Use o modelo em `docs/modelo-planilha.md` para criar os cabecalhos.

## 2. Abrir o Apps Script

Na planilha:

1. Clique em `Extensoes`.
2. Clique em `Apps Script`.
3. Apague o conteudo inicial do arquivo `Code.gs`.
4. Cole o conteudo de `scripts/apps-script/Code.gs`.
5. Salve o projeto com um nome como `API Catalogo Moda`.

## 3. Publicar como Web App

No Apps Script:

1. Clique em `Implantar`.
2. Clique em `Nova implantacao`.
3. Escolha o tipo `App da Web`.
4. Em `Executar como`, selecione `Eu`.
5. Em `Quem pode acessar`, selecione `Qualquer pessoa`.
6. Clique em `Implantar`.
7. Autorize o acesso quando o Google pedir.
8. Copie a URL terminada em `/exec`.

Essa URL sera usada no frontend em uma variavel de ambiente:

```text
VITE_CATALOG_API_URL=https://script.google.com/macros/s/SEU_ID/exec
```

## 4. Testar endpoints

Abra no navegador:

```text
https://script.google.com/macros/s/SEU_ID/exec
https://script.google.com/macros/s/SEU_ID/exec?action=products
https://script.google.com/macros/s/SEU_ID/exec?action=categories
https://script.google.com/macros/s/SEU_ID/exec?action=collections
https://script.google.com/macros/s/SEU_ID/exec?action=config
https://script.google.com/macros/s/SEU_ID/exec?action=product&code=VF-2538
```

## 5. Boas praticas de seguranca

- Nao torne a planilha publica.
- Nao coloque telefone pessoal alternativo, enderecos, documentos ou dados sensiveis na planilha.
- Mantenha a API somente leitura.
- Compartilhe edicao da planilha apenas com quem administra o catalogo.
- Use campos `Ativo` e `Status` para controlar exibicao sem apagar historico.
- Quando alterar o Apps Script, crie uma nova versao de implantacao.

## 6. Quando atualizar produtos

Qualquer alteracao feita na planilha passa a aparecer na API na proxima chamada do site.

Na etapa de conexao do frontend, o site tera cache inteligente para ficar rapido sem exigir muitas chamadas ao Apps Script.
