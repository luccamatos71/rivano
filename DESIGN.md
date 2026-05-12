# DESIGN.md — Rivano
> Estrutura visual inspirada na Gentle Monster. Identidade adaptada para a Rivano.
> Qualquer agente que trabalhe neste projeto deve ler este arquivo antes de criar ou alterar qualquer componente.

---

## Identidade

**Marca:** Rivano
**Produto:** Óculos de sol premium-acessíveis
**Origem:** Salvador, Bahia
**Estética:** Verão europeu — editorial de moda, pele bronzeada, luz dourada, mar, resort, café, barco, revista, lifestyle premium acessível.
**Referência visual:** Gentle Monster — estrutura de grid, proporções, hierarquia, minimalismo, galeria de produto, navegação limpa.
**Posicionamento:** Premium acessível. Não é loja popular. Não é luxo inacessível.

---

## Paleta de cores

| Nome            | Hex       | Uso                                                        |
|-----------------|-----------|------------------------------------------------------------|
| Off-white       | `#F5F1E8` | Fundo principal de todas as páginas                        |
| Areia           | `#D8C7AE` | Fundos de seção secundária, bordas sutis, divisores        |
| Nude quente     | `#C9A98B` | Hover states, destaques de apoio                           |
| Marrom Rivano   | `#6E5542` | Cor da marca — botões primários, CTAs, links               |
| Marrom escuro   | `#3F3028` | Textos, títulos, elementos de alto contraste               |
| Dourado suave   | `#B89B63` | Acentos premium, detalhes decorativos, ícones              |
| Cinza editorial | `#A8A29A` | Textos secundários, legendas, preços, metadados            |

**Regras de cor:**
- Fundo dominante: sempre `#F5F1E8`. Nunca preto como base de página.
- Texto principal: `#3F3028`. Nunca `#000000` puro.
- Botão primário: `background #6E5542` + `color #F5F1E8`.
- Dourado `#B89B63` é acento — nunca cor de fundo ou dominante.
- Areia `#D8C7AE` para separações sutis, nunca bordas pesadas.

---

## Tipografia

Gentle Monster usa tipografia limpa, geométrica e com muito espaçamento. A Rivano adiciona camada serifada editorial nos títulos de destaque.

| Nível              | Fonte               | Peso      | Tratamento                                   |
|--------------------|---------------------|-----------|----------------------------------------------|
| Display / Hero     | Cormorant Garamond  | 300–400   | Grande, tracking amplo, apenas algumas palavras |
| H1 Títulos         | Cormorant Garamond  | 400       | Tracking `0.05em`, nunca condensado          |
| H2–H3 Subtítulos   | DM Sans             | 300       | Uppercase, tracking `0.15em`                 |
| Navegação          | DM Sans             | 400       | Uppercase, tracking `0.12em`, tamanho 12–13px|
| Labels / Tags      | DM Sans             | 400       | Uppercase, tracking `0.15em`, tamanho 11px   |
| Corpo de texto     | DM Sans             | 300–400   | `font-size: 15px`, `line-height: 1.8`        |
| Nome do produto    | DM Sans             | 400       | Normal case, tamanho 14–15px                 |
| Preço              | DM Sans             | 300       | Tamanho 14px, cor `#A8A29A`                  |

**Fontes (Google Fonts):**
```
Cormorant Garamond: 300, 400
DM Sans: 300, 400
```

**Regras tipográficas:**
- Títulos editoriais: sempre com `letter-spacing` generoso — nunca apertado.
- Nunca negrito 700+ em títulos — a leveza é o refinamento.
- Texto de produto: sucinto. Máximo 2 linhas no card, expandido na página.
- Labels e categorias: sempre uppercase com tracking.

---

## Estrutura de páginas

### Home (inspiração Gentle Monster)

Seções em scroll vertical, cada uma ocupando a largura total:

```
1. HERO — imagem ou vídeo full-viewport
   - Texto mínimo: 1 frase curta da marca + CTA sutil
   - Sem carrossel automático agressivo
   - Proporção: 100vw × 100vh desktop, 100vw × 70vh mobile

2. CATÁLOGO RÁPIDO — grid 2 colunas, 4–6 produtos em destaque
   - Label de seção: "COLEÇÃO" ou "MODELOS" — uppercase, tracking largo
   - Link "Ver todos" discreto

3. EDITORIAL — imagem grande full-bleed com frase da marca sobreposta
   - Texto: 1 frase curta, cor off-white, tipografia serifada
   - Sem botão óbvio — link sutil no canto

4. CATÁLOGO COMPLETO ou segunda seleção de produtos

5. SOBRE / IDENTIDADE — parágrafo curto, foto de lifestyle
   - "Nascida em Salvador. Inspirada no verão europeu."

6. FOOTER — minimal
```

---

### Catálogo (PLP — Product Listing Page)

Estrutura baseada na Gentle Monster:

```
- Grid: 2 colunas desktop, 2 colunas mobile (imagens grandes)
- Gap entre cards: 24px desktop, 12px mobile
- Padding lateral da página: 40px desktop, 20px mobile
- Sem sidebar de filtros — filtros opcionais no topo (linha fina)
- Scroll contínuo (sem paginação)
```

**Card de produto:**
```
┌─────────────────────┐
│                     │
│   IMAGEM 3:4        │  ← proporção retrato, object-fit: cover
│   (hover: 2ª foto)  │  ← segunda imagem desliza no hover
│                     │
└─────────────────────┘
  Rivano Balos          ← DM Sans 400, 14px, #3F3028, normal case
  R$ 140                ← DM Sans 300, 14px, #A8A29A
```

**Regras do card:**
- Sem box-shadow pesado. Sombra máxima: `0 2px 8px rgba(63,48,40,0.06)`
- Sem badge "NOVO", "ESGOTADO" em destaque — produto esgotado: opacidade 60% + texto discreto abaixo
- Sem bordas no card
- Hover: segunda imagem aparece com transição `opacity 0.3s ease`
- Background do card: transparente sobre `#F5F1E8`

---

### Página de produto (PDP — Product Detail Page)

Layout baseado na Gentle Monster — galeria à esquerda, informações fixas à direita:

```
Desktop:
┌──────────────────────┬────────────────┐
│                      │ Nome do modelo │
│  GALERIA             │ R$ 140         │
│  (imagens em coluna  │                │
│   vertical, clique   │ Cor / variação │
│   para ampliar)      │ ○ ○ ○          │
│                      │                │
│  Scroll para ver     │ [Pedir pelo    │
│  mais fotos          │  WhatsApp]     │
│                      │                │
│                      │ ── Detalhes ── │
│                      │ UV400          │
│                      │ Case + flanela │
│                      │ Garantia 3m    │
└──────────────────────┴────────────────┘

Mobile:
- Imagens em carrossel horizontal (swipe)
- Informações abaixo da galeria
- Botão WhatsApp fixo no bottom da tela
```

**Galeria:**
- Proporção das imagens: 3:4 (retrato)
- Desktop: coluna vertical de miniaturas à esquerda + imagem principal grande
- Mobile: carrossel com indicadores de ponto
- Sem zoom obrigatório — foco na qualidade da foto

**Painel de informações (sticky no desktop):**
```
Nome: Cormorant Garamond 400, ~28px, #3F3028
Preço: DM Sans 300, 18px, #6E5542
Variações: círculos de cor 20×20px, borda 1px #D8C7AE, selecionado: borda #3F3028
Botão: [Pedir pelo WhatsApp] — ver spec abaixo
Detalhes: accordion simples, linha separadora 1px #D8C7AE
```

---

## Componentes

### Botão primário — "Pedir pelo WhatsApp"
```css
background: #6E5542;
color: #F5F1E8;
border: none;
border-radius: 0;           /* Sem arredondamento — estilo Gentle Monster */
padding: 16px 32px;
font-family: 'DM Sans', sans-serif;
font-weight: 400;
font-size: 13px;
letter-spacing: 0.1em;
text-transform: uppercase;
width: 100%;                /* Full-width na página de produto */
cursor: pointer;
transition: background 0.2s ease;

&:hover {
  background: #3F3028;
}
```

Ícone do WhatsApp: SVG 14px, cor `#F5F1E8`, margem direita 8px. Nunca usar verde do WhatsApp.

### Botão secundário / ghost
```css
background: transparent;
color: #3F3028;
border: 1px solid #3F3028;
/* demais propriedades iguais ao primário */

&:hover {
  background: #3F3028;
  color: #F5F1E8;
}
```

### Navegação
```
- Background: #F5F1E8 (ou transparente sobre hero claro)
- Logo: centralizado
- Links: DM Sans 400, uppercase, tracking 0.12em, 12px, cor #3F3028
- Sem megamenu. Máximo: Modelos | Para ela | Para ele | Sobre
- Mobile: menu hambúrguer, drawer lateral sobre fundo #F5F1E8
```

### Divisor de seção
```css
/* Preferir espaço em branco. Se necessário: */
border: none;
border-top: 1px solid #D8C7AE;
margin: 80px 0;  /* desktop */
margin: 48px 0;  /* mobile */
```

### Tag / Label de seção
```css
font-family: 'DM Sans', sans-serif;
font-size: 11px;
font-weight: 400;
letter-spacing: 0.2em;
text-transform: uppercase;
color: #A8A29A;
margin-bottom: 24px;
```

---

## Espaçamento e grid

```
max-width página: 1280px
padding lateral desktop: 40px
padding lateral mobile: 20px

Seções verticais:
  padding-top/bottom desktop: 100px
  padding-top/bottom mobile: 60px

Grid catálogo:
  colunas desktop: 2
  colunas mobile: 2
  gap desktop: 24px
  gap mobile: 12px

Espaço entre imagem e texto do card: 12px
Espaço entre nome e preço no card: 4px
```

---

## Imagens e direção visual

**Usar:**
- Pele bronzeada com óculos — luz natural, hora dourada
- Mar azul, praia, pedra natural, areia
- Mesa de café ao ar livre, tecido branco, madeira clara
- Embalagem marrom kraft com logo dourado
- Fundo off-white com textura sutil de linho ou papel
- Lifestyle resort, verão europeu

**Proporções:**
- Hero: 16:9 ou full-viewport
- Cards de catálogo: 3:4 (retrato)
- Imagens editoriais entre seções: full-bleed, 16:9 ou panorâmico

**Nunca usar:**
- Fundo preto dominante
- Flash fotográfico duro / estúdio com fundo colorido
- Colagem ou múltiplos elementos sobrepostos
- Flyers com preço em destaque
- Visual de marketplace ou loja popular
- Marca d'água nas fotos

---

## Tom e linguagem

**Princípio:** Poucas palavras. Frases curtas. Elegância sem gritar.

**Frases da marca (usar literalmente):**
- "Nascida em Salvador. Inspirada no verão europeu."
- "Verão no olhar."
- "Elegância para dias de sol."
- "Óculos para viver o verão."
- "Presença sem esforço."
- "O acessório muda tudo."
- "Feed é revista. WhatsApp é loja."

**CTAs:**
- Principal: "Pedir pelo WhatsApp"
- Secundário: "Ver modelos" / "Explorar"
- Nunca: "Comprar agora", "Adicionar ao carrinho", "APROVEITE"

**Descrições de produto:**
- Máximo 2 linhas no card
- Na página de produto: blocos curtos (Detalhes, Como fica) — sem parede de texto
- Nunca inventar dados — se faltar info, deixar o campo vazio

---

## O que nunca fazer

- Preto dominante como cor de fundo
- Botões verdes (exceto ícone SVG discreto do WhatsApp)
- Badges de "NOVO", "PROMOÇÃO", "OFERTA"
- Contagem regressiva ou urgência artificial
- Excesso de texto em qualquer seção
- Tipografia pesada, condensada ou apertada
- Gradientes coloridos, sombras neon, animações chamativas
- Logos de pagamento no hero ou catálogo
- Marca d'água nas fotos de produto
- Visual de panfleto ou loja popular
