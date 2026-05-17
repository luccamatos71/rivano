# PDP Conversion Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevar o CSS da PDP mobile e adicionar 6 novas seções de conversão (urgência de estoque, quiz de formato de rosto, prova social, jornada WhatsApp, CTA editorial, unboxing premium) dentro da estrutura Astro existente.

**Architecture:** CSS elevation in-place (modifica `[slug].astro` sem mudar a estrutura HTML principal), mais 6 novos componentes Astro independentes importados e inseridos no scroll da página. Todo JS usa `is:inline`, CSS scoped por componente.

**Tech Stack:** Astro 4, TypeScript, CSS custom properties (`--rivano-*`), SVG inline, IntersectionObserver, Touch Events API.

---

## File Map

| Arquivo | Ação |
|---|---|
| `src/components/StockUrgency.astro` | Criar |
| `src/components/WhatsAppJourney.astro` | Criar |
| `src/components/MidPageCTA.astro` | Criar |
| `src/components/SocialProof.astro` | Criar |
| `src/components/UnboxingSection.astro` | Criar |
| `src/components/FaceGuide.astro` | Criar (mais complexo) |
| `src/pages/produtos/[slug].astro` | Modificar (CSS + imports + inserção) |

---

## Task 1: StockUrgency.astro

**Files:**
- Create: `src/components/StockUrgency.astro`

- [ ] **Step 1: Criar o componente**

```astro
---
interface Props {
  stock: number;
}

const { stock } = Astro.props as Props;
const show = stock >= 1 && stock <= 9;
const isLow = stock <= 3;
const fillPercent = Math.round((Math.min(stock, 9) / 9) * 100);
const label = isLow
  ? `Últimas ${stock} unidade${stock === 1 ? '' : 's'}`
  : `${stock} unidades disponíveis`;
---

{show && (
  <div class="stock-urgency">
    <div class:list={["stock-label", isLow && "is-low"]}>{label}</div>
    <div class="stock-bar-track">
      <div class="stock-bar-fill" style={`width: ${fillPercent}%`}></div>
    </div>
  </div>
)}

<style>
  .stock-urgency {
    padding: 14px 24px;
    border-bottom: 1px solid color-mix(in srgb, var(--rivano-brown) 10%, transparent);
  }

  .stock-label {
    font-family: var(--font-sans);
    font-size: 9px;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--rivano-brown) 62%, transparent);
    margin-bottom: 8px;
  }

  .stock-label.is-low {
    color: color-mix(in srgb, #c0392b 70%, var(--rivano-brown));
  }

  .stock-bar-track {
    height: 2px;
    background: var(--rivano-beige);
    width: 100%;
    overflow: hidden;
  }

  .stock-bar-fill {
    height: 100%;
    background: var(--rivano-brown-mid);
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .stock-label.is-low ~ .stock-bar-track .stock-bar-fill {
    background: color-mix(in srgb, #c0392b 60%, var(--rivano-brown-mid));
  }
</style>
```

- [ ] **Step 2: Build check**

```bash
cd "Rivano 2" && npm run build
```
Expected: `18 page(s) built` sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/StockUrgency.astro
git commit -m "feat: add StockUrgency component with conditional stock bar"
```

---

## Task 2: WhatsAppJourney.astro

**Files:**
- Create: `src/components/WhatsAppJourney.astro`

- [ ] **Step 1: Criar o componente**

```astro
---
interface Props {
  whatsappUrl: string;
}
const { whatsappUrl } = Astro.props as Props;

const steps = [
  { n: '01', title: 'Toque em "Comprar pelo WhatsApp"', desc: 'Um único toque abre a conversa.' },
  { n: '02', title: 'A mensagem já vem pronta', desc: 'O modelo e suas dúvidas já estão pré-preenchidos.' },
  { n: '03', title: 'Respondemos em até 2 horas', desc: 'Atendimento humano, sem bot.' },
  { n: '04', title: 'Você confirma e decide', desc: 'Frete, estoque e prazo antes de fechar.' },
];
---

<section class="waj-section" aria-labelledby="waj-title">
  <div class="waj-inner">
    <p class="waj-label">Como funciona</p>
    <h2 id="waj-title" class="waj-title">Simples assim.</h2>
    <p class="waj-sub">Compra pelo WhatsApp, do seu jeito.</p>

    <ol class="waj-steps">
      {steps.map((step, i) => (
        <li class="waj-step">
          <div class="waj-step-left">
            <div class="waj-num">{step.n}</div>
            {i < steps.length - 1 && <div class="waj-line"></div>}
          </div>
          <div class="waj-step-body">
            <p class="waj-step-title">{step.title}</p>
            <p class="waj-step-desc">{step.desc}</p>
          </div>
        </li>
      ))}
    </ol>

    <a class="waj-cta" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      Comprar pelo WhatsApp
    </a>
  </div>
</section>

<style>
  .waj-section {
    background: var(--rivano-beige);
    padding: 56px 24px 48px;
  }

  .waj-inner {
    max-width: 480px;
  }

  .waj-label {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--rivano-brown) 45%, transparent);
    margin-bottom: 10px;
  }

  .waj-title {
    font-family: var(--font-serif);
    font-size: clamp(36px, 10vw, 52px);
    font-weight: 300;
    color: var(--rivano-brown);
    line-height: 0.95;
    margin-bottom: 8px;
  }

  .waj-sub {
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 300;
    color: color-mix(in srgb, var(--rivano-brown) 55%, transparent);
    line-height: 1.65;
    margin-bottom: 32px;
  }

  .waj-steps {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 32px;
  }

  .waj-step {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 16px;
    min-height: 60px;
  }

  .waj-step-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .waj-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--rivano-brown);
    color: var(--rivano-off-white);
    font-family: var(--font-sans);
    font-size: 9px;
    font-weight: 400;
    letter-spacing: 0.06em;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .waj-line {
    flex: 1;
    width: 1px;
    background: color-mix(in srgb, var(--rivano-brown) 18%, transparent);
    margin: 4px 0;
  }

  .waj-step-body {
    padding-bottom: 20px;
    padding-top: 6px;
  }

  .waj-step-title {
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    color: var(--rivano-brown);
    line-height: 1.4;
    margin-bottom: 4px;
  }

  .waj-step-desc {
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 300;
    color: color-mix(in srgb, var(--rivano-brown) 55%, transparent);
    line-height: 1.6;
  }

  .waj-cta {
    display: block;
    background: var(--rivano-brown);
    color: var(--rivano-off-white);
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    text-align: center;
    text-decoration: none;
    padding: 15px 24px;
    transition: opacity 0.2s ease-out;
  }

  .waj-cta:hover { opacity: 0.85; }
</style>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```
Expected: `18 page(s) built` sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/WhatsAppJourney.astro
git commit -m "feat: add WhatsAppJourney component (4-step purchase flow)"
```

---

## Task 3: MidPageCTA.astro

**Files:**
- Create: `src/components/MidPageCTA.astro`

- [ ] **Step 1: Criar o componente**

```astro
---
interface Props {
  whatsappUrl: string;
  productName: string;
}
const { whatsappUrl, productName } = Astro.props as Props;
---

<section class="mid-cta" aria-label="Comprar Rivano">
  <div class="mid-cta-inner">
    <p class="mid-cta-label">Rivano</p>
    <h2 class="mid-cta-title">O verão não espera.<br>O {productName} também não.</h2>
    <a class="mid-cta-btn" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      Comprar pelo WhatsApp
    </a>
  </div>
</section>

<style>
  .mid-cta {
    background: var(--rivano-brown);
    padding: 64px 24px;
    color: var(--rivano-off-white);
  }

  .mid-cta-inner {
    max-width: 360px;
  }

  .mid-cta-label {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--rivano-off-white) 40%, transparent);
    margin-bottom: 16px;
  }

  .mid-cta-title {
    font-family: var(--font-serif);
    font-size: clamp(34px, 9vw, 52px);
    font-weight: 300;
    line-height: 1.0;
    color: var(--rivano-off-white);
    margin-bottom: 28px;
  }

  .mid-cta-btn {
    display: inline-block;
    border: 1px solid color-mix(in srgb, var(--rivano-off-white) 55%, transparent);
    color: var(--rivano-off-white);
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 13px 22px;
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    transition: background 0.25s ease-out, border-color 0.25s ease-out;
  }

  .mid-cta-btn:hover {
    background: color-mix(in srgb, var(--rivano-off-white) 10%, transparent);
    border-color: color-mix(in srgb, var(--rivano-off-white) 80%, transparent);
  }
</style>
```

- [ ] **Step 2: Build check + commit**

```bash
npm run build && git add src/components/MidPageCTA.astro && git commit -m "feat: add MidPageCTA editorial component"
```

---

## Task 4: SocialProof.astro

**Files:**
- Create: `src/components/SocialProof.astro`

- [ ] **Step 1: Criar o componente**

```astro
---
const testimonials = [
  {
    quote: "Comprei sem ver pessoalmente e chegou melhor do que esperava. A qualidade surpreende pelo preço.",
    name: "Larissa M.",
    city: "São Paulo, SP",
  },
  {
    quote: "Achei que ia ser mais frágil, mas a armação é robusta. Uso todo dia e continua impecável.",
    name: "Rafael S.",
    city: "Salvador, BA",
  },
  {
    quote: "O atendimento pelo WhatsApp foi rápido demais. Chegou em 3 dias e o case é lindo.",
    name: "Camila O.",
    city: "Rio de Janeiro, RJ",
  },
];
---

<section class="sp-section" aria-labelledby="sp-title">
  <div class="sp-header">
    <p class="sp-label">Quem já comprou</p>
    <h2 id="sp-title" class="sp-title">Eles viram ao vivo.</h2>
  </div>
  <div class="sp-track" role="list">
    {testimonials.map((t) => (
      <article class="sp-card" role="listitem">
        <svg class="sp-quote-icon" width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
          <path d="M0 14V8.4C0 3.73 2.8 1.05 8.4 0l.84 1.68C6.44 2.52 5 4.2 4.76 6.72H8.4V14H0Zm11.6 0V8.4C11.6 3.73 14.4 1.05 20 0l.84 1.68C18.04 2.52 16.6 4.2 16.36 6.72H20V14h-8.4Z" fill="currentColor"/>
        </svg>
        <p class="sp-quote">{t.quote}</p>
        <footer class="sp-author">
          <span class="sp-name">{t.name}</span>
          <span class="sp-city">{t.city}</span>
        </footer>
      </article>
    ))}
  </div>
</section>

<style>
  .sp-section {
    background: var(--rivano-off-white);
    padding: 56px 0 64px;
    overflow: hidden;
  }

  .sp-header {
    padding: 0 24px;
    margin-bottom: 28px;
  }

  .sp-label {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--rivano-brown) 42%, transparent);
    margin-bottom: 8px;
  }

  .sp-title {
    font-family: var(--font-serif);
    font-size: clamp(32px, 9vw, 48px);
    font-weight: 300;
    color: var(--rivano-brown);
    line-height: 0.95;
  }

  .sp-track {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding: 0 24px;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .sp-track::-webkit-scrollbar { display: none; }

  .sp-card {
    flex: 0 0 78vw;
    max-width: 300px;
    scroll-snap-align: start;
    border: 1px solid var(--rivano-beige);
    padding: 24px 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    background: var(--rivano-off-white);
  }

  .sp-quote-icon {
    color: var(--rivano-gold);
    flex-shrink: 0;
  }

  .sp-quote {
    font-family: var(--font-serif);
    font-size: 15px;
    font-weight: 300;
    color: var(--rivano-brown);
    line-height: 1.55;
    flex: 1;
  }

  .sp-author {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sp-name {
    font-family: var(--font-sans);
    font-size: 10px;
    font-weight: 400;
    color: var(--rivano-brown);
    letter-spacing: 0.06em;
  }

  .sp-city {
    font-family: var(--font-sans);
    font-size: 9px;
    font-weight: 300;
    color: color-mix(in srgb, var(--rivano-brown) 45%, transparent);
    letter-spacing: 0.06em;
  }
</style>
```

- [ ] **Step 2: Build check + commit**

```bash
npm run build && git add src/components/SocialProof.astro && git commit -m "feat: add SocialProof component with 3 testimonial cards"
```

---

## Task 5: UnboxingSection.astro

**Files:**
- Create: `src/components/UnboxingSection.astro`

- [ ] **Step 1: Criar o componente**

```astro
---
// Sem props — conteúdo é universal para todos os produtos Rivano
---

<section class="unbox-section" aria-labelledby="unbox-title">
  <div class="unbox-inner">
    <p class="unbox-label">Cada detalhe importa</p>
    <h2 id="unbox-title" class="unbox-title">O que vem<br>na sua caixa.</h2>
    <p class="unbox-sub">Cada pedido é preparado com cuidado para chegar perfeito.</p>

    <ul class="unbox-list">
      <li class="unbox-item" data-unbox-item>
        <div class="unbox-icon" aria-hidden="true">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect x="4" y="16" width="14" height="10" rx="5" stroke="#c4a882" stroke-width="1.4"/>
            <rect x="26" y="16" width="14" height="10" rx="5" stroke="#c4a882" stroke-width="1.4"/>
            <line x1="18" y1="21" x2="26" y2="21" stroke="#c4a882" stroke-width="1.4"/>
            <line x1="2" y1="19" x2="4" y2="19" stroke="rgba(196,168,130,0.5)" stroke-width="1.2"/>
            <line x1="40" y1="19" x2="42" y2="19" stroke="rgba(196,168,130,0.5)" stroke-width="1.2"/>
          </svg>
        </div>
        <div class="unbox-copy">
          <p class="unbox-item-name">Óculos Rivano</p>
          <p class="unbox-item-desc">Proteção UV400 certificada. Armação e lentes inspecionadas.</p>
        </div>
      </li>

      <li class="unbox-item" data-unbox-item>
        <div class="unbox-icon" aria-hidden="true">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect x="4" y="14" width="36" height="18" rx="9" stroke="#c4a882" stroke-width="1.4"/>
            <line x1="4" y1="23" x2="40" y2="23" stroke="#c4a882" stroke-width="1" opacity="0.4"/>
            <circle cx="22" cy="23" r="2" fill="#c4a882" opacity="0.35"/>
          </svg>
        </div>
        <div class="unbox-copy">
          <p class="unbox-item-name">Case exclusivo</p>
          <p class="unbox-item-desc">Proteção rígida para o dia a dia. Design Rivano.</p>
        </div>
      </li>

      <li class="unbox-item" data-unbox-item>
        <div class="unbox-icon" aria-hidden="true">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect x="8" y="8" width="28" height="28" rx="3" stroke="#c4a882" stroke-width="1.4"/>
            <path d="M12,16 Q22,12 32,16 Q22,20 12,16Z" fill="rgba(196,168,130,0.15)" stroke="#c4a882" stroke-width="0.8"/>
            <path d="M12,22 Q22,18 32,22" stroke="#c4a882" stroke-width="0.8" opacity="0.4"/>
            <path d="M12,28 Q22,24 32,28" stroke="#c4a882" stroke-width="0.8" opacity="0.25"/>
          </svg>
        </div>
        <div class="unbox-copy">
          <p class="unbox-item-name">Flanela de limpeza</p>
          <p class="unbox-item-desc">Microfibra suave para as lentes. Inclusa em todo pedido.</p>
        </div>
      </li>

      <li class="unbox-item" data-unbox-item>
        <div class="unbox-icon" aria-hidden="true">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect x="6" y="10" width="32" height="24" rx="2" stroke="#c4a882" stroke-width="1.4"/>
            <line x1="12" y1="18" x2="32" y2="18" stroke="#c4a882" stroke-width="1" opacity="0.5"/>
            <line x1="12" y1="23" x2="26" y2="23" stroke="rgba(196,168,130,0.4)" stroke-width="0.8"/>
            <line x1="12" y1="27" x2="22" y2="27" stroke="rgba(196,168,130,0.3)" stroke-width="0.8"/>
          </svg>
        </div>
        <div class="unbox-copy">
          <p class="unbox-item-name">Garantia e satisfação</p>
          <p class="unbox-item-desc"><strong>7 dias</strong> para satisfação garantida. <strong>3 meses</strong> contra defeitos de fábrica.</p>
        </div>
      </li>
    </ul>
  </div>
</section>

<script is:inline>
  (function () {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-unbox-item]').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    var items = document.querySelectorAll('[data-unbox-item]');
    items.forEach(function (item, i) {
      item.style.transitionDelay = (i * 120) + 'ms';
      observer.observe(item);
    });
  })();
</script>

<style>
  .unbox-section {
    background: #1e1410;
    padding: 56px 24px 52px;
  }

  .unbox-inner {
    max-width: 480px;
  }

  .unbox-label {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(196, 168, 130, 0.45);
    margin-bottom: 10px;
  }

  .unbox-title {
    font-family: var(--font-serif);
    font-size: clamp(34px, 9vw, 52px);
    font-weight: 300;
    color: #f5f0e8;
    line-height: 1.0;
    margin-bottom: 8px;
  }

  .unbox-sub {
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 300;
    color: rgba(245, 240, 232, 0.38);
    line-height: 1.7;
    margin-bottom: 32px;
  }

  .unbox-list {
    list-style: none;
    display: flex;
    flex-direction: column;
  }

  .unbox-item {
    display: grid;
    grid-template-columns: 72px 1fr;
    gap: 16px;
    align-items: center;
    padding: 18px 0;
    border-top: 1px solid rgba(196, 168, 130, 0.1);
    opacity: 0;
    transform: translateX(-14px);
    transition:
      opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .unbox-item:last-child {
    border-bottom: 1px solid rgba(196, 168, 130, 0.1);
  }

  .unbox-item.is-visible {
    opacity: 1;
    transform: translateX(0);
  }

  .unbox-icon {
    width: 72px;
    height: 72px;
    background: rgba(196, 168, 130, 0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .unbox-item-name {
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    color: #f5f0e8;
    line-height: 1.3;
    margin-bottom: 4px;
    letter-spacing: 0.04em;
  }

  .unbox-item-desc {
    font-family: var(--font-sans);
    font-size: 10px;
    font-weight: 300;
    color: rgba(245, 240, 232, 0.42);
    line-height: 1.65;
  }

  .unbox-item-desc strong {
    color: rgba(245, 240, 232, 0.72);
    font-weight: 400;
  }
</style>
```

- [ ] **Step 2: Build check + commit**

```bash
npm run build && git add src/components/UnboxingSection.astro && git commit -m "feat: add UnboxingSection dark premium component with stagger animation"
```

---

## Task 6: FaceGuide.astro

**Files:**
- Create: `src/components/FaceGuide.astro`

Este é o componente mais complexo. Porta o protótipo `face-quiz-v3.html` para Astro.

- [ ] **Step 1: Criar o componente**

```astro
---
interface Props {
  whatsappUrl: string;
  productName: string;
}

const { whatsappUrl, productName } = Astro.props as Props;
---

<section class="fg-section" aria-labelledby="fg-title">
  <div class="fg-trigger-wrap">
    <p class="fg-pre-label">Guia exclusivo</p>
    <h2 id="fg-title" class="fg-trigger-title">Este modelo<br>vai ficar em você?</h2>
    <button class="fg-trigger-btn" id="fg-open" type="button" aria-expanded="false" aria-controls="fg-sheet">
      Descobrir agora
      <span aria-hidden="true">→</span>
    </button>
  </div>

  <!-- Overlay + Sheet -->
  <div class="fg-overlay" id="fg-sheet" role="dialog" aria-modal="true" aria-label="Guia de formato de rosto" aria-hidden="true">
    <div class="fg-sheet" id="fg-sheet-inner">
      <div class="fg-handle" aria-hidden="true"></div>

      <!-- Progress -->
      <div class="fg-progress" id="fg-progress" aria-hidden="true">
        <div class="fg-prog-seg"><div class="fg-prog-fill" id="fg-p1"></div></div>
        <div class="fg-prog-seg"><div class="fg-prog-fill" id="fg-p2"></div></div>
      </div>

      <div class="fg-screens">

        <!-- INTRO -->
        <div class="fg-screen fg-screen--active" id="fg-s0" role="region" aria-label="Introdução">
          <div class="fg-intro-face" aria-hidden="true">
            <svg width="90" height="112" viewBox="0 0 90 112">
              <ellipse cx="45" cy="62" rx="33" ry="44" fill="none" stroke="rgba(196,168,130,0.3)" stroke-width="1.2">
                <animate attributeName="rx" values="33;35;33" dur="4s" repeatCount="indefinite"/>
              </ellipse>
              <rect x="20" y="40" width="20" height="13" rx="6.5" fill="none" stroke="#c4a882" stroke-width="1.4" stroke-dasharray="3,2"/>
              <rect x="50" y="40" width="20" height="13" rx="6.5" fill="none" stroke="#c4a882" stroke-width="1.4" stroke-dasharray="3,2"/>
              <line x1="40" y1="46.5" x2="50" y2="46.5" stroke="#c4a882" stroke-width="1.4" stroke-dasharray="3,2"/>
            </svg>
          </div>
          <p class="fg-step-label">2 perguntas rápidas</p>
          <p class="fg-step-q">A resposta que você precisava antes de comprar.</p>
          <button class="fg-btn-primary" id="fg-start" type="button">Começar</button>
        </div>

        <!-- Q1 -->
        <div class="fg-screen" id="fg-s1" role="region" aria-label="Pergunta 1">
          <div class="fg-face-zone" id="fg-fz1" aria-hidden="true">
            <svg id="fg-face1" width="110" height="146" viewBox="0 0 100 130" style="transition: transform 0.15s ease-out;">
              <path id="fg-fp1"
                d="M50,8 C75,8 82,28 82,55 C82,82 70,95 50,95 C30,95 18,82 18,55 C18,28 25,8 50,8 Z"
                fill="none" stroke="rgba(196,168,130,0.6)" stroke-width="1.5"/>
              <line x1="18" y1="46" x2="10" y2="43" stroke="rgba(196,168,130,0.3)" stroke-width="1"/>
              <line x1="82" y1="46" x2="90" y2="43" stroke="rgba(196,168,130,0.3)" stroke-width="1"/>
            </svg>
            <div class="fg-swipe-hints">
              <span class="fg-hint" id="fg-hint1-nao">← Não</span>
              <span class="fg-hint" id="fg-hint1-sim">Sim →</span>
            </div>
          </div>
          <div class="fg-answer-area">
            <span class="fg-step-label">Pergunta 1 de 2</span>
            <p class="fg-step-q">Sua testa é mais larga que seu queixo?</p>
            <div class="fg-answer-row">
              <button class="fg-answer-card" type="button" data-q="1" data-val="nao">
                <svg width="28" height="34" viewBox="0 0 28 34">
                  <ellipse cx="14" cy="17" rx="11" ry="14" fill="none" stroke="rgba(196,168,130,0.7)" stroke-width="1.2"/>
                  <line x1="3" y1="8" x2="25" y2="8" stroke="rgba(196,168,130,0.4)" stroke-width="1"/>
                  <line x1="4" y1="26" x2="24" y2="26" stroke="rgba(196,168,130,0.4)" stroke-width="1"/>
                </svg>
                <span>Não,<br>proporcionais</span>
              </button>
              <button class="fg-answer-card" type="button" data-q="1" data-val="sim">
                <svg width="28" height="34" viewBox="0 0 28 34">
                  <path d="M14,30 C5,22 2,13 2,8 C2,4 5,2 8,2 C11,2 13,5 14,7 C15,5 17,2 20,2 C23,2 26,4 26,8 C26,13 23,22 14,30Z"
                    fill="none" stroke="rgba(196,168,130,0.7)" stroke-width="1.2"/>
                </svg>
                <span>Sim,<br>testa maior</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Q2 -->
        <div class="fg-screen" id="fg-s2" role="region" aria-label="Pergunta 2">
          <div class="fg-face-zone" id="fg-fz2" aria-hidden="true">
            <svg id="fg-face2" width="110" height="146" viewBox="0 0 100 130" style="transition: transform 0.15s ease-out;">
              <path id="fg-fp2" d="" fill="none" stroke="rgba(196,168,130,0.6)" stroke-width="1.5"/>
              <line x1="18" y1="46" x2="10" y2="43" stroke="rgba(196,168,130,0.3)" stroke-width="1"/>
              <line x1="82" y1="46" x2="90" y2="43" stroke="rgba(196,168,130,0.3)" stroke-width="1"/>
            </svg>
            <div class="fg-swipe-hints">
              <span class="fg-hint" id="fg-hint2-nao">← Não</span>
              <span class="fg-hint" id="fg-hint2-sim">Sim →</span>
            </div>
          </div>
          <div class="fg-answer-area">
            <span class="fg-step-label">Pergunta 2 de 2</span>
            <p class="fg-step-q">Seu rosto é mais longo que largo?</p>
            <div class="fg-answer-row">
              <button class="fg-answer-card" type="button" data-q="2" data-val="nao">
                <svg width="28" height="34" viewBox="0 0 28 34">
                  <ellipse cx="14" cy="17" rx="13" ry="9" fill="none" stroke="rgba(196,168,130,0.7)" stroke-width="1.2"/>
                </svg>
                <span>Não,<br>arredondado</span>
              </button>
              <button class="fg-answer-card" type="button" data-q="2" data-val="sim">
                <svg width="28" height="34" viewBox="0 0 28 34">
                  <ellipse cx="14" cy="17" rx="7" ry="14" fill="none" stroke="rgba(196,168,130,0.7)" stroke-width="1.2"/>
                </svg>
                <span>Sim,<br>alongado</span>
              </button>
            </div>
          </div>
        </div>

        <!-- RESULT -->
        <div class="fg-screen fg-screen--result" id="fg-sr" role="region" aria-label="Resultado">
          <div class="fg-result-upper">
            <div class="fg-ring-wrap" aria-hidden="true">
              <svg class="fg-ring-svg" viewBox="0 0 130 130">
                <circle fill="none" stroke="rgba(196,168,130,0.08)" stroke-width="3" cx="65" cy="65" r="60"/>
                <circle id="fg-ring" fill="none" stroke="#c4a882" stroke-width="3" stroke-linecap="round"
                  cx="65" cy="65" r="60"
                  stroke-dasharray="377" stroke-dashoffset="377"
                  transform="rotate(-90 65 65)"
                  style="transition: stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1);"/>
              </svg>
              <div class="fg-ring-face">
                <svg width="80" height="100" viewBox="0 0 100 130">
                  <path id="fg-rfp" d="" fill="none" stroke="rgba(196,168,130,0.4)" stroke-width="1.3"/>
                  <g id="fg-rg" style="opacity:0;transition:opacity 0.6s 0.7s ease,transform 0.6s 0.7s cubic-bezier(0.16,1,0.3,1);transform:translateY(4px)">
                    <rect x="18" y="42" width="26" height="16" rx="8" fill="none" stroke="#c4a882" stroke-width="2"/>
                    <rect x="56" y="42" width="26" height="16" rx="8" fill="none" stroke="#c4a882" stroke-width="2"/>
                    <line x1="44" y1="50" x2="56" y2="50" stroke="#c4a882" stroke-width="2"/>
                    <line x1="8" y1="47" x2="18" y2="47" stroke="rgba(196,168,130,0.5)" stroke-width="1.5"/>
                    <line x1="82" y1="47" x2="92" y2="47" stroke="rgba(196,168,130,0.5)" stroke-width="1.5"/>
                  </g>
                </svg>
              </div>
            </div>
            <p class="fg-result-badge" id="fg-rbadge">Combinação Perfeita</p>
            <p class="fg-result-verdict" id="fg-rverdict">Este modelo foi feito para você.</p>
            <p class="fg-result-copy" id="fg-rcopy">Seu formato equilibra qualquer frame. O {productName} realça seus traços naturalmente.</p>
          </div>
          <div class="fg-result-lower">
            <a class="fg-btn-whatsapp" id="fg-rwpp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Comprar pelo WhatsApp
            </a>
            <button class="fg-btn-reset" id="fg-reset" type="button">Refazer o guia</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

<script is:inline>
(function () {
  var FACES = {
    oval:    'M50,8 C75,8 82,28 82,55 C82,82 70,95 50,95 C30,95 18,82 18,55 C18,28 25,8 50,8 Z',
    redondo: 'M50,12 C74,12 84,32 84,52 C84,74 70,90 50,90 C30,90 16,74 16,52 C16,32 26,12 50,12 Z',
    coracao: 'M50,88 C28,70 8,50 8,28 C8,14 18,8 28,8 C36,8 44,13 50,22 C56,13 64,8 72,8 C82,8 92,14 92,28 C92,50 72,70 50,88 Z',
    quadrado:'M22,10 Q22,8 28,8 L72,8 Q78,8 78,14 L78,82 Q78,92 68,92 L32,92 Q22,92 22,82 Z',
    alongado:'M50,4 C68,4 76,22 76,55 C76,88 64,98 50,98 C36,98 24,88 24,55 C24,22 32,4 50,4 Z'
  };

  var RESULTS = {
    perfeito: { score: 100, badge: '✦ Combinação Perfeita', verdict: 'Este modelo foi feito para você.', face: 'oval' },
    favoravel:{ score: 84,  badge: '◆ Muito Favorável',     verdict: 'O modelo vai te favorecer bastante.', face: 'redondo' },
    funciona: { score: 70,  badge: '○ Funciona Bem',         verdict: 'Uma escolha elegante para você.', face: 'quadrado' }
  };

  var ans = {};
  var swipeX = 0;
  var mDown = false;
  var mX = 0;

  var overlay  = document.getElementById('fg-sheet');
  var openBtn  = document.getElementById('fg-open');
  var startBtn = document.getElementById('fg-start');
  var resetBtn = document.getElementById('fg-reset');
  var ring     = document.getElementById('fg-ring');
  var rGlasses = document.getElementById('fg-rg');
  var rFacePath= document.getElementById('fg-rfp');

  function openSheet() {
    overlay.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSheet() {
    overlay.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function goTo(id) {
    document.querySelectorAll('.fg-screen').forEach(function (s) {
      s.classList.remove('fg-screen--active');
    });
    var el = document.getElementById(id);
    if (el) el.classList.add('fg-screen--active');
  }

  function setProgress(p1, p2) {
    document.getElementById('fg-p1').style.width = p1 + '%';
    document.getElementById('fg-p2').style.width = p2 + '%';
  }

  function answer(q, val) {
    ans[q] = val;
    if (navigator.vibrate) navigator.vibrate(10);

    if (q === 1) {
      var fp2 = document.getElementById('fg-fp2');
      if (fp2) {
        fp2.style.d = 'path("' + (val === 'sim' ? FACES.coracao : FACES.oval) + '")';
        fp2.setAttribute('d', val === 'sim' ? FACES.coracao : FACES.oval);
      }
      goTo('fg-s2');
      setProgress(100, 50);
    } else {
      var type;
      if (ans[1] === 'nao' && val === 'nao') type = 'perfeito';
      else if (ans[1] === 'nao' && val === 'sim') type = 'favoravel';
      else type = 'funciona';
      showResult(type);
    }
  }

  function showResult(type) {
    var r = RESULTS[type];
    document.getElementById('fg-rbadge').textContent = r.badge;
    document.getElementById('fg-rverdict').textContent = r.verdict;
    rFacePath.setAttribute('d', FACES[r.face]);
    if (rFacePath.style) rFacePath.style.d = 'path("' + FACES[r.face] + '")';

    ring.style.strokeDashoffset = '377';
    rGlasses.style.opacity = '0';
    rGlasses.style.transform = 'translateY(4px)';

    goTo('fg-sr');
    setProgress(100, 100);

    setTimeout(function () {
      ring.style.strokeDashoffset = String(377 - (377 * r.score / 100));
    }, 300);

    setTimeout(function () {
      rGlasses.style.opacity = '1';
      rGlasses.style.transform = 'translateY(0)';
    }, 800);
  }

  function resetQuiz() {
    ans = {};
    setProgress(0, 0);
    goTo('fg-s0');
  }

  // Swipe helpers
  function applyTilt(svgId, dx) {
    var el = document.getElementById(svgId);
    if (el) el.style.transform = 'rotate(' + Math.max(-18, Math.min(18, dx * 0.1)) + 'deg)';
  }

  function resetTilt(svgId) {
    var el = document.getElementById(svgId);
    if (el) { el.style.transition = 'transform 0.4s ease'; el.style.transform = 'rotate(0deg)'; }
  }

  function highlightHint(q, dx) {
    var prefix = q === 1 ? 'fg-hint1' : 'fg-hint2';
    var nEl = document.getElementById(prefix + '-nao');
    var sEl = document.getElementById(prefix + '-sim');
    if (!nEl || !sEl) return;
    nEl.classList.toggle('fg-hint--active', dx < -30);
    sEl.classList.toggle('fg-hint--active', dx > 30);
  }

  function resetHints(q) {
    var prefix = q === 1 ? 'fg-hint1' : 'fg-hint2';
    ['nao','sim'].forEach(function(v) {
      var el = document.getElementById(prefix + '-' + v);
      if (el) el.classList.remove('fg-hint--active');
    });
  }

  // Touch events
  [1, 2].forEach(function (q) {
    var fz = document.getElementById('fg-fz' + q);
    var svgId = 'fg-face' + q;
    if (!fz) return;

    fz.addEventListener('touchstart', function (e) { swipeX = e.touches[0].clientX; }, { passive: true });
    fz.addEventListener('touchmove', function (e) {
      var dx = e.touches[0].clientX - swipeX;
      applyTilt(svgId, dx);
      highlightHint(q, dx);
    }, { passive: true });
    fz.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - swipeX;
      resetTilt(svgId);
      resetHints(q);
      if (Math.abs(dx) > 55) answer(q, dx > 0 ? 'sim' : 'nao');
    });

    fz.addEventListener('mousedown', function (e) { mDown = true; mX = e.clientX; });
    fz.addEventListener('mousemove', function (e) {
      if (!mDown) return;
      var dx = e.clientX - mX;
      applyTilt(svgId, dx);
      highlightHint(q, dx);
    });
    fz.addEventListener('mouseup', function (e) {
      if (!mDown) return;
      mDown = false;
      var dx = e.clientX - mX;
      resetTilt(svgId);
      resetHints(q);
      if (Math.abs(dx) > 55) answer(q, dx > 0 ? 'sim' : 'nao');
    });
    fz.addEventListener('mouseleave', function () {
      if (!mDown) return;
      mDown = false;
      resetTilt(svgId);
      resetHints(q);
    });
  });

  // Answer card clicks
  document.querySelectorAll('.fg-answer-card').forEach(function (btn) {
    btn.addEventListener('click', function () {
      answer(Number(btn.getAttribute('data-q')), btn.getAttribute('data-val'));
    });
  });

  // Controls
  if (openBtn) openBtn.addEventListener('click', openSheet);
  if (startBtn) startBtn.addEventListener('click', function () { goTo('fg-s1'); setProgress(50, 0); });
  if (resetBtn) resetBtn.addEventListener('click', function () { resetQuiz(); });

  // Close on overlay click
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSheet();
    });
  }
})();
</script>

<style>
  .fg-section {
    background: var(--rivano-off-white);
    padding: 48px 24px;
    border-top: 1px solid var(--rivano-beige);
  }

  .fg-pre-label {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--rivano-brown) 42%, transparent);
    margin-bottom: 8px;
  }

  .fg-trigger-title {
    font-family: var(--font-serif);
    font-size: clamp(30px, 8vw, 44px);
    font-weight: 300;
    color: var(--rivano-brown);
    line-height: 1.05;
    margin-bottom: 20px;
  }

  .fg-trigger-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 1px solid var(--rivano-brown);
    color: var(--rivano-brown);
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 12px 18px;
    min-height: 48px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .fg-trigger-btn:hover {
    background: var(--rivano-brown);
    color: var(--rivano-off-white);
  }

  /* Overlay */
  .fg-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(26, 18, 16, 0);
    pointer-events: none;
    transition: background 0.35s ease-out;
  }

  .fg-overlay[aria-hidden="false"] {
    background: rgba(26, 18, 16, 0.7);
    pointer-events: auto;
  }

  /* Sheet */
  .fg-sheet {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 86%;
    background: #0e0a08;
    border-radius: 20px 20px 0 0;
    transform: translateY(100%);
    transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .fg-overlay[aria-hidden="false"] .fg-sheet {
    transform: translateY(0);
  }

  .fg-handle {
    width: 36px;
    height: 3px;
    background: rgba(196, 168, 130, 0.2);
    border-radius: 2px;
    margin: 12px auto 0;
    flex-shrink: 0;
  }

  /* Progress */
  .fg-progress {
    display: flex;
    gap: 4px;
    padding: 14px 24px 0;
    flex-shrink: 0;
  }

  .fg-prog-seg {
    height: 2px;
    flex: 1;
    background: rgba(196, 168, 130, 0.12);
    border-radius: 1px;
    overflow: hidden;
  }

  .fg-prog-fill {
    height: 100%;
    background: #c4a882;
    width: 0%;
    transition: width 0.6s ease;
  }

  /* Screens */
  .fg-screens {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .fg-screen {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    opacity: 0;
    transform: translateX(30px) scale(0.97);
    pointer-events: none;
    transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    overflow-y: auto;
  }

  .fg-screen--active {
    opacity: 1;
    transform: translateX(0) scale(1);
    pointer-events: auto;
  }

  /* Intro screen */
  #fg-s0 {
    align-items: center;
    justify-content: center;
    padding: 28px 28px 32px;
    gap: 0;
    text-align: center;
  }

  .fg-intro-face {
    margin-bottom: 24px;
    filter: drop-shadow(0 0 14px rgba(196, 168, 130, 0.15));
  }

  /* Q screens */
  .fg-face-zone {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: grab;
    user-select: none;
    background: radial-gradient(ellipse at 50% 55%, rgba(196, 168, 130, 0.04) 0%, transparent 70%);
    min-height: 160px;
  }

  .fg-swipe-hints {
    position: absolute;
    bottom: 12px;
    left: 24px;
    right: 24px;
    display: flex;
    justify-content: space-between;
  }

  .fg-hint {
    font-family: var(--font-sans);
    font-size: 7px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(196, 168, 130, 0.2);
    transition: color 0.2s;
  }

  .fg-hint--active { color: rgba(196, 168, 130, 0.75); }

  .fg-answer-area {
    padding: 16px 24px 28px;
    flex-shrink: 0;
    background: #0e0a08;
  }

  .fg-step-label {
    display: block;
    font-family: var(--font-sans);
    font-size: 8px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(196, 168, 130, 0.4);
    margin-bottom: 6px;
  }

  .fg-step-q {
    font-family: var(--font-serif);
    font-size: 18px;
    font-weight: 300;
    color: #f5f0e8;
    line-height: 1.25;
    margin-bottom: 18px;
  }

  .fg-answer-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .fg-answer-card {
    background: rgba(245, 240, 232, 0.04);
    border: 1px solid rgba(196, 168, 130, 0.14);
    padding: 14px 10px 12px;
    cursor: pointer;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    transition: background 0.2s, border-color 0.2s;
  }

  .fg-answer-card:hover, .fg-answer-card:active {
    background: rgba(196, 168, 130, 0.1);
    border-color: rgba(196, 168, 130, 0.4);
  }

  .fg-answer-card span {
    font-family: var(--font-sans);
    font-size: 9px;
    color: rgba(245, 240, 232, 0.65);
    letter-spacing: 0.04em;
    line-height: 1.4;
  }

  /* Result */
  .fg-screen--result {
    flex-direction: column;
  }

  .fg-result-upper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 24px 16px;
    text-align: center;
    background: radial-gradient(ellipse at 50% 45%, rgba(196, 168, 130, 0.07) 0%, transparent 65%);
  }

  .fg-ring-wrap {
    width: 130px;
    height: 130px;
    position: relative;
    margin-bottom: 20px;
  }

  .fg-ring-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .fg-ring-face {
    position: absolute;
    inset: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fg-result-badge {
    font-family: var(--font-sans);
    font-size: 8px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #c4a882;
    margin-bottom: 8px;
  }

  .fg-result-verdict {
    font-family: var(--font-serif);
    font-size: 20px;
    font-weight: 300;
    color: #f5f0e8;
    line-height: 1.2;
    margin-bottom: 8px;
  }

  .fg-result-copy {
    font-family: var(--font-sans);
    font-size: 10px;
    font-weight: 300;
    color: rgba(245, 240, 232, 0.45);
    line-height: 1.75;
    max-width: 240px;
  }

  .fg-result-lower {
    padding: 16px 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid rgba(196, 168, 130, 0.08);
  }

  .fg-btn-primary, .fg-btn-whatsapp {
    display: block;
    width: 100%;
    background: #c4a882;
    color: #0e0a08;
    border: none;
    padding: 14px;
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .fg-btn-primary:hover, .fg-btn-whatsapp:hover { opacity: 0.85; }

  .fg-btn-reset {
    background: transparent;
    border: 1px solid rgba(196, 168, 130, 0.2);
    color: rgba(245, 240, 232, 0.4);
    font-family: var(--font-sans);
    font-size: 8px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 10px;
    cursor: pointer;
    width: 100%;
    transition: border-color 0.2s, color 0.2s;
  }

  .fg-btn-reset:hover {
    border-color: rgba(196, 168, 130, 0.4);
    color: rgba(245, 240, 232, 0.65);
  }
</style>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```
Expected: `18 page(s) built` sem erros. Se TypeScript reclamar de `style.d`, ignorar — é CSS custom property que browsers modernos suportam; o `setAttribute` é o fallback.

- [ ] **Step 3: Commit**

```bash
git add src/components/FaceGuide.astro
git commit -m "feat: add FaceGuide interactive quiz component (swipe, ring animation, dark sheet)"
```

---

## Task 7: CSS Elevation — Galeria mobile (overlay nome/preço)

**Files:**
- Modify: `src/pages/produtos/[slug].astro`

Localizar o bloco `<div class="mobile-gallery"` e a div `<div class="mobile-slide"`. Adicionar overlay com nome e preço sobre a imagem.

- [ ] **Step 1: Adicionar overlay HTML dentro de `.mobile-slide`**

Localizar no template (linha ~189):
```astro
{imageSets.map((imageSet, index) => (
  <figure class="mobile-slide" data-slide={index}>
    <img ... />
  </figure>
))}
```

Substituir por:
```astro
{imageSets.map((imageSet, index) => (
  <figure class="mobile-slide" data-slide={index}>
    <img
      src={`/${imageSet.src}`}
      srcset={buildSrcset(imageSet)}
      sizes="100vw"
      alt={`${product.name} - foto ${index + 1}`}
      class="mobile-gallery-image"
      loading={index === 0 ? "eager" : "lazy"}
      fetchpriority={index === 0 ? "high" : undefined}
      decoding="async"
      width="900"
      height="1200"
    />
    {index === 0 && (
      <div class="gallery-overlay" aria-hidden="true">
        <div class="gallery-gradient"></div>
        <div class="gallery-product-info">
          <span class="gallery-product-name">{product.name}</span>
          <span class="gallery-product-price">{formattedPrice}</span>
        </div>
      </div>
    )}
  </figure>
))}
```

- [ ] **Step 2: Adicionar CSS do overlay**

No bloco `<style>` existente, localizar `.mobile-gallery-image` e adicionar após:

```css
.mobile-slide {
  position: relative; /* garantir que o overlay fica dentro */
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.gallery-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 52%;
  background: linear-gradient(
    0deg,
    color-mix(in srgb, var(--rivano-off-white) 85%, transparent) 0%,
    color-mix(in srgb, var(--rivano-off-white) 18%, transparent) 60%,
    transparent 100%
  );
}

.gallery-product-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gallery-product-name {
  font-family: var(--font-serif);
  font-size: 38px;
  font-weight: 300;
  color: var(--rivano-brown);
  line-height: 0.95;
  letter-spacing: 0;
}

.gallery-product-price {
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 300;
  color: color-mix(in srgb, var(--rivano-brown) 70%, transparent);
}
```

Também atualizar `.mobile-slide` existente — remover `aspect-ratio` e usar `min-height`:
```css
.mobile-slide {
  /* ANTES: aspect-ratio: 3 / 4; */
  min-height: 88svh;
  background: color-mix(in srgb, var(--rivano-off-white) 82%, var(--rivano-beige));
  display: flex;
  flex: 0 0 100vw;
  justify-content: center;
  margin: 0;
  overflow: hidden;
  scroll-snap-align: start;
  align-items: flex-start;
}
```

E atualizar `.mobile-gallery-image`:
```css
.mobile-gallery-image {
  aspect-ratio: 3 / 4;
  display: block;
  height: auto;
  mix-blend-mode: multiply;
  object-fit: cover;
  width: 100%;
}
```

- [ ] **Step 3: Esconder nome/preço no painel quando overlay está visível (mobile)**

No bloco de media queries, adicionar:
```css
@media (max-width: 767px) {
  .product-heading {
    display: none;
  }
}
```

- [ ] **Step 4: Build check**

```bash
npm run build
```
Expected: `18 page(s) built` sem erros.

- [ ] **Step 5: Commit**

```bash
git add src/pages/produtos/[slug].astro
git commit -m "feat: add product name/price overlay on mobile gallery with gradient"
```

---

## Task 8: CSS Elevation — Action strip, sticky bar e tipografia

**Files:**
- Modify: `src/pages/produtos/[slug].astro`

- [ ] **Step 1: Action strip — breadcrumb oculto no mobile**

No CSS do `.product-breadcrumb`, adicionar:
```css
.product-breadcrumb {
  display: none; /* já existe no mobile — mover para desktop only */
}

@media (min-width: 768px) {
  .product-breadcrumb {
    display: flex;
  }
}
```

- [ ] **Step 2: CTA mobile mais alto**

Localizar `.whatsapp-cta` e atualizar:
```css
.whatsapp-cta {
  margin-top: 4px;
  min-height: 56px; /* era 54px */
  width: 100%;
}
```

- [ ] **Step 3: Tipografia desktop do product title**

```css
@media (min-width: 768px) {
  .product-title {
    font-size: 64px; /* era 58px */
    max-width: 520px;
  }
}
```

- [ ] **Step 4: Accordion mais editorial**

```css
.accordion-item summary {
  font-size: 13px; /* era 12px */
  letter-spacing: 0.1em;
}
```

- [ ] **Step 5: Sticky bar mobile — adicionar nome e preço**

Localizar no HTML:
```astro
<div class="mobile-sticky-cta" data-mobile-sticky-cta hidden>
  <div class="mobile-sticky-copy">
    <p>{product.name}</p>
    <span>{formattedPrice}</span>
  </div>
  <a class="mobile-sticky-link" href={whatsappUrl} data-whatsapp-link>{ctaLabel}</a>
</div>
```

Este já existe com `.mobile-sticky-copy`. Atualizar CSS para altura maior:
```css
.mobile-sticky-cta {
  min-height: 60px; /* era implícito — adicionar explícito */
  padding: 10px 16px calc(12px + env(safe-area-inset-bottom));
}

.mobile-sticky-link {
  flex: 1; /* ocupar mais espaço */
  max-width: 180px;
}
```

- [ ] **Step 6: Build check + commit**

```bash
npm run build && git add src/pages/produtos/[slug].astro && git commit -m "feat: CSS elevation — action strip, accordion typography, sticky bar"
```

---

## Task 9: Integração — Importar e inserir todos os componentes

**Files:**
- Modify: `src/pages/produtos/[slug].astro`

- [ ] **Step 1: Adicionar imports no frontmatter**

No início do frontmatter (logo após os imports existentes):
```astro
import StockUrgency from "../../components/StockUrgency.astro";
import FaceGuide from "../../components/FaceGuide.astro";
import WhatsAppJourney from "../../components/WhatsAppJourney.astro";
import MidPageCTA from "../../components/MidPageCTA.astro";
import SocialProof from "../../components/SocialProof.astro";
import UnboxingSection from "../../components/UnboxingSection.astro";
```

- [ ] **Step 2: Inserir StockUrgency**

Localizar no template a linha que começa `<div class="technical-accordion">` e inserir antes:
```astro
<StockUrgency stock={currentStock} />
```

- [ ] **Step 3: Inserir FaceGuide**

Após o fechamento do `</div>` da `technical-accordion` section e antes da `assisted-section`:
```astro
<FaceGuide whatsappUrl={whatsappUrl} productName={product.name} />
```

- [ ] **Step 4: Inserir SocialProof**

Após a `assisted-section` (que tem os 3 cards de atendimento/envio/troca):
```astro
<SocialProof />
```

- [ ] **Step 5: Inserir WhatsAppJourney**

Após `<SocialProof />`:
```astro
<WhatsAppJourney whatsappUrl={whatsappUrl} />
```

- [ ] **Step 6: Inserir MidPageCTA**

Após `<WhatsAppJourney />`:
```astro
<MidPageCTA whatsappUrl={whatsappUrl} productName={product.name} />
```

- [ ] **Step 7: Inserir UnboxingSection**

Após `<MidPageCTA />` e antes da `related-section`:
```astro
<UnboxingSection />
```

- [ ] **Step 8: Build check final**

```bash
npm run build
```
Expected: `18 page(s) built` sem erros, sem warnings de TypeScript.

- [ ] **Step 9: Commit de integração**

```bash
git add src/pages/produtos/[slug].astro
git commit -m "feat: integrate all PDP conversion components into product page"
```

---

## Task 10: Push e verificação final

- [ ] **Step 1: Push para o GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Deploy Vercel**

```bash
npx vercel --prod
```
Expected: `Production` URL retornada. Confirmar que o deploy passou sem erros.

- [ ] **Step 3: Verificação visual mobile**

Abrir a URL de produção no celular (Chrome mobile) e verificar:
- [ ] Galeria ocupa ~88% da tela com nome e preço sobrepostos
- [ ] Scroll desce para o painel com CTA
- [ ] StockUrgency aparece (testar com produto de estoque 1-9)
- [ ] Accordions abrem corretamente
- [ ] Botão "Descobrir agora" abre o sheet do FaceGuide
- [ ] Quiz completo: swipe funciona, resultado aparece com anel animado
- [ ] SocialProof, WhatsAppJourney, MidPageCTA e UnboxingSection aparecem no scroll
- [ ] Sticky CTA bar aparece após rolar além do CTA principal

---

## Self-Review

**Spec coverage:**
- [x] CSS elevation galeria mobile → Task 7
- [x] Overlay nome/preço → Task 7
- [x] Action strip (painel mobile) → Task 8
- [x] Sticky bar melhorada → Task 8
- [x] StockUrgency (stock 1-9, lógica correta) → Task 1
- [x] FaceGuide quiz (swipe, morph, ring, 3 resultados) → Task 6
- [x] SocialProof (3 depoimentos) → Task 4
- [x] WhatsAppJourney (4 passos) → Task 2
- [x] MidPageCTA (escuro, copy editorial) → Task 3
- [x] UnboxingSection (escuro, animação sequencial, garantias corretas 7d/3m) → Task 5
- [x] Integração na [slug].astro → Task 9

**Placeholder scan:** Nenhum TBD, TODO ou "implement later" no plano.

**Type consistency:** `whatsappUrl: string` e `productName: string` usados consistentemente em FaceGuide, WhatsAppJourney e MidPageCTA. `stock: number` em StockUrgency. Props batem com o que está disponível em `[slug].astro` (`whatsappUrl`, `product.name`, `currentStock`).
