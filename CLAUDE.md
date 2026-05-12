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
| `DESIGN.md` | Guia visual obrigatório — ler antes de mexer em UI |
| `AGENTS.md` | Regras de comportamento do agente |
| `src/data/products.json` | Fonte da verdade dos produtos |
| `public/products/<slug>/` | Fotos otimizadas em .webp |
| `public/banners/` | Banners do hero (temporários) |
| `src/styles/global.css` | Tokens de cor e classes base |

## Páginas
- `/` → Home
- `/catalogo` → Grid de produtos com filtro
- `/produtos/[slug]` → Produto individual + WhatsApp CTA

## Regras
- Sempre ler `DESIGN.md` antes de criar ou alterar UI
- Nunca inventar dados de produto — marcar como incompleto
- Sem checkout, sem carrinho, sem login
- CTA principal: "Pedir pelo WhatsApp" → `wa.me/5571993135522`
