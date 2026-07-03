# Catalogo Online Inteligente

Catalogo online de moda feminina com administracao via Google Sheets e atendimento pelo WhatsApp.

## Etapa atual

Etapa 4 concluida: frontend conectado ao contrato da API, com cache local e fallback para dados demonstrativos.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Proximas etapas

1. Implementar busca instantanea, filtros e ordenacao reais.
2. Evoluir a pagina de produto com galeria, WhatsApp, QR Code e compartilhamento.
3. Implementar favoritos e vistos recentemente com LocalStorage.

## API Google Sheets

A Etapa 3 adicionou:

- `scripts/apps-script/Code.gs`: API JSON somente leitura.
- `scripts/apps-script/README-publicacao-api.md`: guia para publicar a API.
- `docs/modelo-planilha.md`: estrutura da planilha.
- `docs/contrato-api.md`: formato dos endpoints e respostas.

Copie `.env.example` para `.env.local` quando tiver a URL publicada do Apps Script.

Exemplo:

```text
VITE_CATALOG_API_URL=https://script.google.com/macros/s/SEU_ID/exec
```

No Netlify, cadastre a mesma chave em `Site configuration > Environment variables`.

Enquanto essa variavel nao estiver configurada, o site usa dados demonstrativos locais.
