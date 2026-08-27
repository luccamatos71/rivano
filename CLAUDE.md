# Rivano — Site próprio de óculos

## Stack
Astro · Tailwind · TypeScript · Node 20+

## Comandos
```
npm run dev          # localhost:4321
npm run build        # dist/
npm run import       # CSV → src/data/products.json
npm run scrape:images # baixa e otimiza fotos dos produtos
```

## Arquivos críticos
| Arquivo | O que é |
|---|---|
| `AGENTS.md` | Regras de comportamento do agente |
| `src/pages/index.astro` | Home e seus blocos editoriais mobile-first |
| `src/data/products.json` | Fonte da verdade dos produtos |
| `public/products/<slug>/` | Fotos otimizadas em .webp |
| `public/banners/` | Assets de hero da Home |
| `public/editorial/` | Assets das campanhas/editoriais da Home |
| `public/editorial/lifestyle/` | Fotos de pessoas usando Rivano (seção `rivano-fits`) |
| `src/styles/global.css` | Tokens de cor e classes base |

## Páginas
- `/` → Home
- `/catalogo` → Grid de produtos com filtro
- `/produtos/[slug]` → Produto individual + WhatsApp CTA

## Regras
- Nunca inventar dados de produto — marcar como incompleto
- Sem checkout, sem carrinho, sem login
- CTA principal: "Pedir pelo WhatsApp" → `wa.me/5571993135522`

## Estado atual da Home (preservar salvo tarefa explicitamente limitada)
- A Home é mobile-first e os blocos aprovados acima da campanha editorial não devem ser reinterpretados: hero, navegação, seleção inicial de produtos e o Product Hero IBIZA.
- O Product Hero IBIZA é uma comparação direta de duas fotos em `src/pages/index.astro`: scroll vertical permanece nativo; o usuário arrasta horizontalmente o divisor. Não reintroduzir transição guiada por scroll, carrossel, hotspot ou render 3D.
- O manifesto `rivano-travel-manifesto` é tipografia pura, com copy e composição aprovadas. Não adicionar imagem, CTA ou efeitos nesse bloco.
- `rivano-summer-notes` usa a arte final `public/editorial/rivano-summer-notes-final.webp`. A tipografia “ÚLTIMO barco.” e a assinatura já estão incorporadas no asset: não duplicá-las em HTML/CSS. O inset inferior esquerdo continua usando `rivano-summer-notes.webp`, sem ícone/interação.
- `summer-selection` vem imediatamente após essa arte: grid mobile de duas colunas com Saint Tropez, Tropea, Mykonos e Positano, nesta ordem. Dados, preços e rotas vêm de `products.json`. O cabeçalho “SELEÇÃO DE VERÃO” compartilha o eixo esquerdo do inset por `--summer-notes-inset-left`.
- Os derivados transparentes `public/products/rivano-*/editorial-grid.webp` foram gerados a partir dos originais para este grid. Preservar os originais; não voltar a usar blend modes ou tiles/cards com fundo branco para esses quatro produtos.
- `rivano-fits` ("Rivano Society") ocupa a posição do antigo manifesto, logo depois de `summer-selection`. É um clone estrutural deliberado da seção "Worn by the family" de fouramsterdam.com — protótipo em avaliação, não RIVANIZAR a geometria sem aprovação: grid 2 colunas com herói span 2 linhas (mobile 156×405 + células 4:5; ≥768 colunas 55/45 com linhas fixas de 300px), gutter 16→20, margens 24, headline 24px com `text-indent: 50px`, labels brancos 11px sobre gradiente, CTA sublinhado (rodapé no mobile, topo direito ≥768).
- O herói de `rivano-fits` usa `<picture>`: retrato `rivano-lifestyle-02.webp` até 1199px e o derivado `rivano-lifestyle-02-wide.webp` (recorte 1.2:1 do original, top=1100) a partir de 1200px. Copy e labels são placeholder de protótipo; a foto da marina golden hour (`-03`) está reservada, fora desta rodada.
- A linguagem estabelecida para esses blocos é cream/off-white, tipografia marrom escura, objetos isolados, fotografia dominante e ausência de cards, sombras, pills ou chrome de ecommerce genérico.
