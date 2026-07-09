# SC Stays Collection — Histórico e Pendências

> `✅` = implementado | `⏳` = aguarda conteúdo/ação sua | `🎨` = tarefa de design/produção | `🔧` = próximo passo técnico

---

## Parte 1 — Implementado

### SEO Técnico (`__root.tsx`)

| O que | Detalhe |
|-------|---------|
| ✅ `lang="pt-BR"` | Corrigido de `lang="en"` |
| ✅ JSON-LD `LocalBusiness` | Nome, telefone, área (Florianópolis), Instagram, URL, categorias |
| ✅ `og:url`, `og:locale`, `og:site_name` | `https://www.scstays.com.br`, `pt_BR`, `SC Stays Collection` |
| ✅ `og:image` absoluto | `https://www.scstays.com.br/og-image.jpg` (arquivo pendente — ver item 12) |
| ✅ `og:image:width/height/alt` | 1200×630, alt descritivo |
| ✅ `<link rel="canonical">` | Aponta para URL de produção |
| ✅ Meta description com cidades | Florianópolis explícitos |
| ✅ `fetchPriority="high"` no hero | Melhora LCP (Core Web Vitals) |
| ✅ GA4 — infraestrutura | Script condicional via `VITE_GA_ID` no `.env` |

### Landing de proprietários (`/parceiros`)

| O que | Detalhe |
|-------|---------|
| ✅ Faixa de plataformas | Airbnb · Booking.com · Temporada Livre |
| ✅ Cidades no hero | "Florianópolis · São José · Grande Florianópolis, SC" |
| ✅ CTA intermediário | Faixa navy "Seu imóvel pode estar rendendo mais" → WhatsApp |
| ✅ FAQ | 6 perguntas com respostas, cidades corretas |
| ✅ Formulário de lead | 5 campos; envio abre WhatsApp com dados pré-preenchidos |
| ✅ WhatsApp floating button | Botão verde fixo, visível em todas as seções |
| ✅ WhatsApp pré-preenchido | Todos os links WA com mensagem pronta |
| ✅ E-mail no footer | `contato@scstays.com.br` com ícone |

### Navegação (`__root.tsx`)

| O que | Detalhe |
|-------|---------|
| ✅ Menu mobile (hamburger) | Aparece em telas `< md`; dropdown com links + "Fale Conosco" |
| ✅ Header route-aware | `/` → sem header; `/parceiros` → nav completa; `/admin*` → sem header; `/imoveis*` → logo + "Sou proprietário →" |

### Arquitetura de rotas (SC-005/006)

| Rota | Arquivo | Detalhe |
|------|---------|---------|
| ✅ `/` | `routes/index.tsx` | Home bifurcação: "Quero alugar" e "Sou proprietário"; logo hero centralizado; sem header global |
| ✅ `/parceiros` | `routes/parceiros.tsx` | Landing institucional B2B (proprietários); ex-`index.tsx` |
| ✅ Imagem home | `sc-stays-logo-hero-readable.png` | Logo hero na bifurcação |
| ✅ Logo header/footer | `sc-stays-logo-transparent.png` | Usado no Header e footer de `/parceiros` |

### Catálogo de hóspedes (SC-013/014)

| Rota | Arquivo | Detalhe |
|------|---------|---------|
| ✅ `/imoveis` | `routes/imoveis.tsx` | Catálogo com grid de cards; slider de fotos nos cards (setas + dots + contador); sub-nav sticky |
| ✅ `/imoveis/$slug` | `routes/imoveis.$slug.tsx` | Detalhe com carrossel (shadcn Carousel), stats, amenidades, CTA WhatsApp pré-preenchido com nome do imóvel |
| ✅ Mock data | `src/lib/mock-properties.ts` | 3 imóveis mock; estrutura idêntica ao schema Supabase futuro |

### Seções de prova social em `/imoveis`

| Seção | Detalhe |
|-------|---------|
| ✅ Sub-nav sticky | 4 âncoras: Imóveis · Resultados · Avaliações · Depoimentos; seção ativa detectada por IntersectionObserver |
| ✅ Resultados | 4 cards navy: 10 anos de experiência, 100% vistoriados, suporte 24h, atendimento dedicado — **flag ativo, badge "exemplo" visível** |
| ✅ Avaliações | Notas Airbnb (4,9), Booking.com (9,4), Google (4,8) com estrelas visuais — **flag ativo, badge "exemplo" visível** |
| ✅ Depoimentos | 3 depoimentos sobre a experiência de atendimento SC Stays — **flag ativo, badge "exemplo" visível** |
| ✅ Feature flags | `src/lib/feature-flags.ts` — todos em `true`; badge tracejado "exemplo" sinaliza seções com dado fictício |
| ✅ Logo home (`/`) | Trocado para `sc-stays-logo-transparent.png` (igual ao header) |

---

## Parte 2 — Pendências

### ⏳ Conteúdo para substituir os mocks

**`[PRECISA DE VOCÊ]`** — substituo em minutos quando receber:

| Item | O que enviar | Onde aparece |
|------|-------------|--------------|
| Métricas reais | Taxa de ocupação, aumento de receita %, nota média, nº de imóveis | `/parceiros` seção Resultados + `/imoveis` seção Resultados |
| Notas reais nos apps | Print ou números exatos do Airbnb, Booking, Google | `/imoveis` seção Avaliações |
| Depoimentos de hóspedes | Nome, cidade, texto 2–4 frases sobre atendimento SC Stays | `/imoveis` seção Depoimentos |
| Depoimentos de proprietários | Nome, cidade, texto sobre gestão | `/parceiros` (seção a criar quando tiver conteúdo) |
| Fotos dos imóveis reais | — | Virá do Supabase Storage (SC-008) |

---

### ⏳ D. Google Analytics (GA4)

1. Acesse [analytics.google.com](https://analytics.google.com) → crie propriedade para `www.scstays.com.br`
2. Copie o Measurement ID (formato `G-XXXXXXXXXX`)
3. Crie `.env` na raiz:
   ```
   VITE_GA_ID=G-XXXXXXXXXX
   ```

---

### ⏳ G. Google Business Profile

1. Acesse [business.google.com](https://business.google.com)
2. Crie/reivindique "SC Stays Collection"
3. Preencha: Florianópolis, `(48) 99182-2477`, `www.scstays.com.br`, categoria: **Serviço de gestão de propriedades**
4. Verifique o perfil

---

### ⏳ 11. Seção "Quem Somos" em `/parceiros`

Dado disponível: 10 anos de experiência no mercado.

**`[PRECISA DE VOCÊ]`**
- Foto profissional do(a) fundador(a) ou equipe
- Bio de 3–5 frases

---

### 🎨 12. Imagem OG (`public/og-image.jpg`)

O código aponta para `https://www.scstays.com.br/og-image.jpg` — arquivo ainda não existe.

**Spec para o designer:** 1200 × 630 px · paleta cream/navy/gold · logo + tagline + foto ao fundo · salvar em `public/og-image.jpg`

**Provisório:** `Copy-Item src\assets\hero-living.jpg public\og-image.jpg`

---

### 🔧 SC-007/008 — Supabase (próximo passo técnico)

```bash
npm install @supabase/supabase-js
```

Criar projeto no Supabase, adicionar ao `.env`:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # nunca com prefixo VITE_
```

Schema SQL completo em `docs/SC-000-diagnostico.md` seção 5.

---

### 🔧 SC-009 — Basic Auth para `/admin/*`

Middleware Nitro em `src/start.ts`. Vars necessárias:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=senha-segura
```

---

### 🔧 SC-010–012 — Painel admin de imóveis

Rotas a criar: `/admin`, `/admin/imoveis`, `/admin/imoveis/novo`, `/admin/imoveis/$id`
Componentes disponíveis: `table`, `form`, `input`, `textarea`, `select`, `dialog`, `skeleton`, `sonner` — todos em `src/components/ui/`

---

## Resumo executivo das pendências

| Prioridade | Item | Quem |
|-----------|------|------|
| 🔴 Alta | Supabase + schema (SC-007/008) | Dev |
| 🔴 Alta | Fotos e dados reais dos imóveis | Você |
| 🟡 Média | Métricas e depoimentos reais | Você coleta → Dev implementa |
| 🟡 Média | Basic Auth admin (SC-009) | Dev |
| 🟡 Média | Painel admin CRUD (SC-010–012) | Dev |
| 🟢 Baixa | Google Analytics (GA4) | Você cria conta → Dev ativa |
| 🟢 Baixa | Google Business Profile | Você |
| 🟢 Baixa | Seção "Quem Somos" | Você envia foto/bio → Dev implementa |
| 🟢 Baixa | OG Image 1200×630 | Designer |
