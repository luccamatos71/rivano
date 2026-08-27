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
| `public/editorial/lifestyle/` | Fotos de pessoas usando Rivano (faixa `rivano-lifestyle`) |
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
- `rivano-lifestyle` ("Rivano em movimento") substituiu o antigo bloco marrom `manifesto-section` e vem logo depois de `summer-selection`: é a virada de produto para pessoas. Faixa horizontal de fotografia lifestyle com uma foto dominante e as vizinhas cortadas nas duas bordas, mais headline pesada em `--font-sans`. Sem texto, preço, badge ou overlay sobre as fotos — a fotografia continua fotografia.
- O recorte da borda esquerda vem de um clone da última foto (`--lifestyle-lead`), fora do alcance da rolagem; as dez fotos reais continuam todas acessíveis. Três degraus: empilhado no mobile, empilhado com tipo maior em 768px, faixa e headline lado a lado alinhadas pela base em 1024px.
- A headline de `rivano-lifestyle` ainda é PLACEHOLDER: trocar o array `lifestyleHeadlineLines` no frontmatter — um `<span>` por linha. Linhas longas voltam a quebrar sozinhas na coluna estreita do desktop.
- A linguagem estabelecida para esses blocos é cream/off-white, tipografia marrom escura, objetos isolados, fotografia dominante e ausência de cards, sombras, pills ou chrome de ecommerce genérico.
