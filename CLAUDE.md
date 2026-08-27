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
- `rivano-fits` ("Rivano Society") ocupa a posição do antigo manifesto, logo depois de `summer-selection`. É um clone estrutural do bloco entre "Summer in the city" e "Jacket in denim" da página Paulas Ibiza da loewe.com — protótipo em avaliação, não RIVANIZAR a geometria sem aprovação. Duas faixas coladas, sem gutter em nenhum ponto: **duo** (2 células de 50%, proporção 3:4) e **mosaico** (dominante de 2 unidades + menores de 1 unidade, proporção 2:3, alinhadas ao topo — o branco abaixo das menores é intencional). A faixa vale 4 unidades no mobile e 6 em ≥768px, onde entram 2 menores extras (`--wide-only`) e margens laterais de 24px.
- O peso da seção vem da escala da fotografia sobre o canvas off-white, **não** de massa de cor: a tentativa anterior com fundo marrom cheio foi rejeitada. Nada de cards, sombras, cantos, molduras ou overlays.
- A célula dominante usa `rivano-lifestyle-02-tall.webp` (recorte 2:3 do original, não-destrutivo): no 4:5 original a figura encolhia dentro do quadro 2:3. Papéis: 05 e 01 no duo; 02-tall dominante; 10 e 04 menores; 03 e 06 só em ≥768px.
- A headline mantém cada frase em `<span>` próprio: a quebra cai entre as frases, nunca dentro de "Somewhere under the sun.".
- A linguagem estabelecida para esses blocos é cream/off-white, tipografia marrom escura, objetos isolados, fotografia dominante e ausência de cards, sombras, pills ou chrome de ecommerce genérico.
