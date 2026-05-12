# Rivano

Infraestrutura mínima de dados para o catálogo de óculos da Rivano.

1. Coloque o CSV exportado da Nuvemshop em `data-source/products.csv`.
2. Rode `npm run import` para gerar `src/data/products.json`.
3. Rode `npm run scrape:images` para baixar/otimizar as fotos e atualizar `src/data/products.json`.
