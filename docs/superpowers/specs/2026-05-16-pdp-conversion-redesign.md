# PDP Conversion Redesign — Spec
**Data:** 2026-05-16  
**Projeto:** Rivano 2 (Astro + Tailwind + TypeScript)  
**Escopo:** CSS elevation + novas seções de conversão na página de produto (`/produtos/[slug]`)  
**Foco:** Mobile-first  

---

## Contexto

A PDP atual tem estrutura sólida (galeria carousel mobile, painel com variações, sticky CTA bar, accordions, relacionados). O objetivo é elevar o CSS dentro dessa estrutura e adicionar seções estratégicas de conversão para venda via WhatsApp.

**Não é uma reescrita de layout** — é elevação CSS + novos blocos Astro inseridos no scroll da página.

---

## Direção visual

- **Referência:** SSENSE, Net-a-Porter (fashion + conversão) com elementos Jacquemus (imersivo, editorial)
- **Paleta:** mantém `--rivano-off-white`, `--rivano-beige`, `--rivano-brown`, `--rivano-gold`
- **Tipografia:** mantém Cormorant Garamond + DM Sans
- **Motion:** `cubic-bezier(0.16, 1, 0.3, 1)` — editorial, spring suave

---

## 1. CSS Elevation — Estrutura existente

### 1.1 Galeria mobile
- Aumentar altura do carousel: `aspect-ratio: 3/4` → altura mínima de `88svh`
- Sobrepor nome do produto + preço sobre a imagem (position absolute, bottom-left)
- Nome: Cormorant Garamond, 38px, `font-weight: 300`, `color: #3f3028`
- Preço: DM Sans, 16px, abaixo do nome
- Gradiente sutil na base da imagem para legibilidade do overlay

### 1.2 Painel mobile (logo abaixo da galeria)
- Transformar em "action strip" focado: variação → CTA → trust
- Remover breadcrumb do topo (vai para accordion ou omitir)
- CTA mais alto: `min-height: 56px`
- Trust strip: manter os 4 itens em grid 2×2

### 1.3 Tipografia geral
- Produto name desktop: `font-size: 64px`
- Accordion summaries: `font-size: 13px`, `letter-spacing: 0.1em`
- Microcopy: `font-size: 12px`, `color: rgba(63,48,40,0.6)`

### 1.4 Sticky CTA bar (mobile)
- Adicionar nome do produto truncado + preço à esquerda
- CTA ocupa `flex: 1` à direita
- Altura: `56px + safe-area-inset-bottom`

---

## 2. Novas seções

### 2.1 Urgência de estoque
**Posição:** logo abaixo do painel, acima dos accordions  
**Lógica:** lê `product.stock` do produto atual

```
stock >= 10 → não exibe (abundância não cria urgência)
stock 4-9  → "X unidades disponíveis" + barra ~50% preenchida
stock 1-3  → "Últimas X unidades" + barra quase vazia + texto vermelho suave
stock 0    → não exibe (produto indisponível já tem tratamento)
```

**Visual:**
- Label: `8px`, uppercase, `letter-spacing: 0.14em`
- Barra: `height: 2px`, `background: --rivano-beige`, fill `--rivano-brown-mid`
- Cor alerta: `color-mix(in srgb, #c0392b 70%, var(--rivano-brown))` apenas no texto

---

### 2.2 Quiz de Formato de Rosto (interativo)
**Posição:** após accordions  
**Referência visual:** protótipo V3 construído no brainstorming (face-quiz-v3.html)

**Fluxo:**
1. Trigger button discreto: "Vai ficar bom em você? →"
2. Bottom sheet sobe com animação (`translateY(100%) → 0`, `cubic-bezier(0.16,1,0.3,1)`)
3. Intro screen: face SVG animada com óculos hint
4. Pergunta 1: "Sua testa é mais larga que seu queixo?"
   - Resposta por swipe (L/R) ou tap nos cards
   - Face SVG inclina durante o swipe (rotate feedback)
5. Pergunta 2: "Seu rosto é mais longo que largo?"
   - Face SVG muda forma entre Q1 e Q2 (CSS path transition)
6. Resultado: anel de compatibilidade animado (SVG stroke-dashoffset) + óculos aparece sobre rosto + copy personalizado + CTA WhatsApp

**3 resultados possíveis:**
- Combinação Perfeita (100%) — oval, testa proporcional
- Muito Favorável (84%) — redondo ou coração  
- Funciona Bem (70%) — quadrado ou alongado

**Cada produto terá seu próprio mapeamento** de formato → copy de resultado (definido no `products.json` ou como constante no componente).

**Implementação:** componente Astro `FaceGuide.astro` com `<script is:inline>` para o JS do quiz. CSS scoped no componente.

---

### 2.3 Prova Social
**Posição:** após o quiz de formato  
**Conteúdo:** 3 depoimentos curtos — texto + nome + cidade  
**Visual:** scroll horizontal, cards com borda `--rivano-beige`, tipografia serif  
**Dados:** hardcoded por enquanto (aguarda depoimentos reais)

---

### 2.4 Jornada WhatsApp — "O que acontece depois?"
**Posição:** após prova social  
**Objetivo:** remover fricção pré-CTA — medo de comprometimento  

**Visual:** 4 passos em linha vertical (step indicator)
```
① Você toca em "Comprar pelo WhatsApp"
② A mensagem já vem pré-preenchida com o modelo
③ Respondemos em até 2 horas úteis
④ Confirmamos estoque, frete e você decide
```

**Design:** fundo `--rivano-beige`, ícones numéricos circulares `--rivano-brown`, linha conectora vertical entre passos, CTA ao final.

---

### 2.5 CTA Editorial Mid-page
**Posição:** após Jornada WhatsApp  
**Design:** fundo `--rivano-brown` (igual ao manifesto da home), frase curta da marca, botão WhatsApp em `--rivano-off-white`  
**Copy sugerida:** "O verão não espera. O modelo também não."

---

### 2.6 O que vem na caixa
**Posição:** após CTA editorial, antes dos relacionados  
**Design:** Versão B (fundo escuro `#1e1410`), animação sequencial de entrada nos itens

**4 itens:**
| Item | Ícone SVG | Descrição |
|---|---|---|
| Óculos Rivano | Silhueta de óculos | Proteção UV400 certificada. Armação e lentes inspecionadas. |
| Case exclusivo | Case oval | Proteção rígida para o dia a dia. Design Rivano. |
| Flanela de limpeza | Tecido dobrado | Microfibra suave para as lentes. Inclusa em todo pedido. |
| Garantia | Card/documento | **7 dias** para satisfação. **3 meses** contra defeitos de fábrica. |

**Animação:** itens entram com `opacity: 0 + translateX(-12px)` → visível, stagger de 120ms, acionado por `IntersectionObserver`.

---

## 3. Scroll map mobile completo

```
① Galeria full-width (nome/preço overlay, 88svh)
② Action strip — variação + CTA + trust strip
③ Urgência de estoque (condicional, stock 1-9)
④ Accordions (detalhes do modelo, como fica, o que acompanha, trocas)
⑤ Quiz Formato de Rosto (trigger → bottom sheet)
⑥ Prova Social (3 cards em scroll horizontal)
⑦ Jornada WhatsApp (4 passos)
⑧ CTA Editorial mid-page (manifesto escuro)
⑨ O que vem na caixa (fundo escuro, animação sequencial)
⑩ Produtos relacionados (scroll horizontal existente)
⬛ Sticky CTA bar (fixo no rodapé, visível após CTA principal sair do viewport)
```

---

## 4. Arquivos a criar/modificar

| Arquivo | Ação |
|---|---|
| `src/pages/produtos/[slug].astro` | Modificar: CSS elevation + inserir novos componentes |
| `src/components/FaceGuide.astro` | Criar: quiz interativo completo |
| `src/components/StockUrgency.astro` | Criar: barra de urgência de estoque |
| `src/components/WhatsAppJourney.astro` | Criar: jornada 4 passos |
| `src/components/UnboxingSection.astro` | Criar: "o que vem na caixa" versão escura |
| `src/components/MidPageCTA.astro` | Criar: CTA editorial manifesto |
| `src/components/SocialProof.astro` | Criar: 3 depoimentos |

---

## 5. Constraints técnicos

- Astro estático — sem SSR, sem fetch client-side
- Todos os dados de produto vêm de `productsData` (prop já disponível na página)
- JS deve ser `is:inline` ou `is:module` — sem bundler externo
- CSS scoped nos componentes Astro — sem Tailwind nos novos componentes (manter consistência com o padrão atual de CSS-in-template)
- Build deve passar em `npm run build` sem warnings
- Mobile-first: desktop fica bem, mas não é prioridade desta iteração

---

## 6. O que NÃO está no escopo

- Redesign da página de catálogo
- Redesign da home
- Backend / formulário real
- AR try-on com câmera
- Sistema de reviews real (prova social é hardcoded)
