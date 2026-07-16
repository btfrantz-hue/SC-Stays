# SC Stays Collection — Histórico e Pendências

> `✅` = implementado | `⏳` = aguarda conteúdo/ação sua | `🎨` = tarefa de design/produção | `🔧` = próximo passo técnico

---

## Parte 1 — Implementado

### Identidade visual — rebranding (2026-07-14)

| O que | Detalhe |
|-------|---------|
| ✅ Paleta de cores atualizada | `src/styles.css` — token `--navy` passou de azul-marinho para verde-esmeralda. Ajustado 2x: primeiro para `#0B6E4F` (hex de marca informado), depois para `#054839` — cor medida diretamente dos pixels da letra no `new_logo.png`, que é mais escura que o hex de marca por causa do degradê/relevo da arte. `--gold` passou de dourado pastel para `#D3AF37` (dourado do novo logo). Novos tokens auxiliares: `--navy-soft`, `--gold-deep` |
| ✅ `--ink`/`--muted-ink` recalibrados | Hue alinhado ao verde (172.5) em vez do azul antigo (260), evitando texto com viés azulado sobre fundo verde |
| ✅ Sombra do `slide-frame` | Atualizada para usar o novo hue verde em vez do azul hardcoded |
| ✅ Logo trocado | `src/assets/new_logo.png` (fornecido) processado para `src/assets/new-logo-transparent.png` (fundo removido via chroma-key + crop) e usado em `__root.tsx` (header), `index.tsx` (home) e `parceiros.tsx` (header + footer) |

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
| ✅ Imagem home | `new-logo-transparent.png` | Logo hero na bifurcação (atualizado no rebranding, ver acima) |
| ✅ Logo header/footer | `new-logo-transparent.png` | Usado no Header e footer de `/parceiros` (atualizado no rebranding, ver acima) |

### Catálogo de hóspedes (SC-013/014)

| Rota | Arquivo | Detalhe |
|------|---------|---------|
| ✅ `/imoveis` | `routes/imoveis.tsx` | Catálogo com grid de cards; slider de fotos nos cards (setas + dots + contador); sub-nav sticky; **dados vêm do Supabase** (`listActiveProperties`) |
| ✅ `/imoveis/$slug` | `routes/imoveis.$slug.tsx` | Detalhe com carrossel (shadcn Carousel), stats, amenidades, CTA WhatsApp pré-preenchido com nome do imóvel; **dados vêm do Supabase** (`getActiveProperty`) |
| ✅ Dados reais | Tabela `properties` no Supabase | Os 3 imóveis que antes eram mock (`mock-properties.ts`, removido) agora são registros reais em `status = 'active'` |
| ⏳ Fotos reais | `src/lib/property-image-fallback.ts` | **Temporário**: todo imóvel usa as mesmas 3 imagens locais (`hero-living`, `bedroom`, `coast`) até o bucket do Storage existir (SC-008) |

### Seções de prova social em `/imoveis` (2026-07-15 — migradas para o Supabase + admin)

| Seção | Detalhe |
|-------|---------|
| ✅ Sub-nav sticky | Só lista âncoras de seções visíveis; seção ativa detectada por IntersectionObserver |
| ✅ Catálogo | Grid de imóveis — visibilidade controlável em `/admin/pagina-imoveis` |
| ✅ Resultados | 4 cards (ícone + valor + legenda) — texto e ícone editáveis, visibilidade controlável |
| ✅ Avaliações | Notas Airbnb/Booking.com/Google com estrelas — valores editáveis, visibilidade controlável |
| ✅ Depoimentos | Lista dinâmica — admin adiciona/edita/remove depoimentos, visibilidade controlável |
| ✅ `/admin/pagina-imoveis` | Tela única com switch de visibilidade + edição de conteúdo de cada seção; botão "Salvar alterações" |
| ✅ Feature flags removidas | `src/lib/feature-flags.ts` deletado — visibilidade agora é 100% controlada pelo banco (`site_sections`), sem precisar de deploy para mudar |
| ✅ Badge "exemplo" removido | Conteúdo agora é gerenciável pelo cliente via admin, deixou de ser fictício por definição |
| ✅ Logo home (`/`) | Trocado para `new-logo-transparent.png` (igual ao header) |

---

## Parte 2 — Pendências

### ⏳ Conteúdo para substituir os mocks

**`[PRECISA DE VOCÊ]`** — os itens de `/imoveis` (Resultados, Avaliações, Depoimentos) agora você mesmo edita em `/admin/pagina-imoveis`, sem precisar pedir pro dev. Falta só:

| Item | O que enviar | Onde aparece |
|------|-------------|--------------|
| Métricas reais para `/parceiros` | Taxa de ocupação, aumento de receita %, nota média, nº de imóveis | `/parceiros` seção Resultados (ainda hardcoded — não migrado para o admin) |
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
Retorno: Criado.

---

### ⏳ G. Google Business Profile

1. Acesse [business.google.com](https://business.google.com)
2. Crie/reivindique "SC Stays Collection"
3. Preencha: Florianópolis, `(48) 99182-2477`, `www.scstays.com.br`, categoria: **Serviço de gestão de propriedades**
4. Verifique o perfil
Retorno: Criado.
---

### ⏳ 11. Seção "Quem Somos" em `/parceiros`

Dado disponível: 10 anos de experiência no mercado.

**`[PRECISA DE VOCÊ]`**
- Foto profissional do(a) fundador(a) ou equipe
- Bio de 3–5 frases

---

### 🎨 12. Imagem OG (`public/og-image.jpg`)

O código aponta para `https://www.scstays.com.br/og-image.jpg` — arquivo ainda não existe.

**Spec para o designer:** 1200 × 630 px · paleta cream / verde `#054839` / dourado `#D3AF37` (nova identidade, ver "Identidade visual — rebranding" acima) · logo + tagline + foto ao fundo · salvar em `public/og-image.jpg`

**Provisório:** `Copy-Item src\assets\hero-living.jpg public\og-image.jpg`

---

### SC-007 — Supabase: schema e clients (2026-07-14)

| O que | Detalhe |
|-------|---------|
| ✅ `@supabase/supabase-js` instalado | `package.json` |
| ✅ Projeto Supabase conectado | `zeiauwvkfgibysayvhxu` (ref em `.mcp.json`); `.env` local criado com `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` reais |
| ✅ `src/lib/supabase.ts` | Client browser (anon key) — usado também nos loaders públicos de `/imoveis` |
| ✅ `src/lib/supabase.server.ts` | Client server (`createSupabaseServerClient()`, service role — só usado dentro de `createServerFn`) |
| ✅ Schema aplicado no banco remoto | Migrations `sc007_create_properties_schema` + `sc010_add_visible_fields_to_properties` — tabelas `properties` (+ coluna `visible_fields jsonb`) e `property_images`, RLS habilitado (leitura pública só de imóveis `status = 'active'`). Advisor de segurança: 0 alertas |

### ✅ SC-009 — Login do admin (2026-07-15, substitui Basic Auth)

Trocado o popup nativo de Basic Auth por uma página de login própria (`/admin/login`) com sessão em cookie selado (criptografado + assinado, via `useSession` do TanStack Start).

| O que | Detalhe |
|-------|---------|
| ✅ `src/lib/admin-session.ts` | `getAdminSession`/`setAdminAuthenticated`/`clearAdminSession` — cookie `sc_admin_session`, 8h de validade, `httpOnly`, `secure` (auto em https) |
| ✅ `src/lib/admin-auth.server.ts` | `adminLogin`/`adminLogout` (server functions) + `requireAdminMiddleware` |
| ✅ `/admin/login` | `routes/admin.login.tsx` — formulário simples com a cara do site |
| ✅ Botão "Sair" | Header do admin (`routes/admin.tsx`) |
| ✅ `src/start.ts` | Redireciona páginas `/admin/*` sem sessão para `/admin/login` (conveniência de UX) |
| 🔒 **Correção de segurança** | As chamadas RPC de server functions (`/_serverFn/...`) **não** passam pelo middleware de página — só pelo pathname `/admin/*`. Isso deixava `listAdminProperties`/`createAdminProperty`/etc. acessíveis diretamente sem nenhuma autenticação, mesmo com o Basic Auth antigo. Corrigido anexando `requireAdminMiddleware` (middleware de função) a cada server function admin individualmente — é essa camada, não o redirect de página, que garante a proteção real. Confirmado com teste automatizado: chamada direta ao endpoint sem sessão agora falha. |

**`[PRECISA DE VOCÊ]`** — trocar `ADMIN_PASSWORD` no `.env` por uma senha forte antes de deploy/compartilhamento (senha atual é de desenvolvimento local).
BF.:Feito.

### ✅ SC-010–012 — Painel admin de imóveis (2026-07-14)

| Rota | Arquivo | Detalhe |
|------|---------|---------|
| `/admin` | `routes/admin.tsx` | Layout (sem header/rodapé globais) + dashboard |
| `/admin/imoveis` | `routes/admin.imoveis.tsx` | Tabela com nome, slug, status, link de edição e **excluir** (2026-07-15) |
| `/admin/imoveis/novo` | `routes/admin.imoveis.novo.tsx` | Formulário de criação |
| `/admin/imoveis/$id` | `routes/admin.imoveis.$id.tsx` | Formulário de edição |

CRUD via server functions (`src/lib/properties.server.ts`, service role, ignora RLS — só acessível atrás do login).

**Excluir imóvel (2026-07-15):** botão de lixeira por linha na lista, com `AlertDialog` de confirmação (ação irreversível — apaga o imóvel e, por `on delete cascade`, suas fotos em `property_images`). Server function `deleteAdminProperty`.

**Bug de cache corrigido (2026-07-15):** depois de criar/editar um imóvel e voltar pra lista, ela às vezes continuava mostrando os dados antigos. Causa: `/admin/imoveis/novo` e `/admin/imoveis/$id` são rotas *filhas* de `/admin/imoveis` (convenção de arquivo com ponto) — o loader da lista já tinha rodado como rota pai, e o TanStack Router não recarrega automaticamente ao voltar pra ela (o match "permanece", não "entra de novo"). Corrigido chamando `router.invalidate()` antes de navegar de volta, nos três fluxos (criar/editar/excluir).

**Controle de visibilidade por campo (pedido extra, 2026-07-14):** cada imóvel tem uma coluna `visible_fields` (jsonb). No formulário admin (`src/components/admin/property-form.tsx`), os campos que aparecem publicamente (descrição curta, bairro, quartos, banheiros, hóspedes, descrição completa, comodidades) têm um checkbox "Visível no site" ao lado do texto — desmarcar oculta o campo em `/imoveis` e `/imoveis/$slug` sem apagar o valor salvo. Testado ponta a ponta com Playwright (editar → desmarcar → salvar → conferir que some do catálogo → reverter).

### ⏳ SC-008 — Storage de imagens (próximo passo técnico)

Bucket `property-images` (público) ainda não criado. Até lá, todo imóvel usa o fallback local (ver tabela acima). Ver `docs/SC-000-diagnostico.md` seção 6.

### ✅ SC-019 — Captura de leads + indicadores de performance (2026-07-15)

Duas tabelas no Supabase, RLS habilitado e sem policy (só `service_role` acessa; inserts/leituras passam por server functions em `src/lib/leads.server.ts`):

| Tabela | O que guarda | Preenchida por |
|--------|-------------|-----------------|
| `proposal_leads` | Envios do formulário "Receba uma proposta" em `/parceiros` (nome, e-mail, telefone, bairro, situação, status de acompanhamento) | `submitProposalLead` — chamada pelo `LeadForm` ao clicar "Quero uma proposta", em paralelo à abertura do WhatsApp |
| `whatsapp_clicks` | Cada clique em botão de WhatsApp pelo site (página, botão, imóvel se aplicável) | `logWhatsappClick`/`trackWhatsappClick` — instrumentado em 5 pontos: botão flutuante, CTA intermediário e rodapé de `/parceiros`, CTA geral de `/imoveis`, CTA do imóvel em `/imoveis/$slug` |

`/admin/leads` (`routes/admin.leads.tsx`) — reformulado em 2026-07-15 para ser um log + painel de indicadores:
- **KPIs no topo:** total de propostas, total de cliques no WhatsApp (últimos 500), taxa aproximada proposta/clique, propostas aguardando contato — cada um com contagem dos últimos 30 dias
- **Breakdown de cliques por origem** (página + botão), ordenado do mais pro menos clicado
- **Duas abas** (Propostas / Cliques no WhatsApp) com a tabela detalhada — status da proposta editável direto na linha (novo/contatado/convertido/perdido)
- **Exportar CSV** — botão em cada aba, baixa a lista completa (`src/lib/csv.ts`)

Testado ponta a ponta: formulário salva no banco e aparece no admin; clique em WhatsApp salva e aparece no admin; export CSV dispara download; tudo protegido por `requireAdminMiddleware`.

### ✅ Situação atual do imóvel — mais opções (2026-07-15)

Select do formulário "Receba uma proposta" (`/parceiros`) ampliado de 3 para 7 opções, incluindo "Tenho gestora, quero trocar", "Uso só para mim, ainda não aluguei", "Imóvel em construção ou reforma" e **"Prefiro não informar agora"** (pra quem não quer compartilhar). Campo continua `text` livre no banco — não precisou de migration.

### ✅ SC-021 — Admin da página /imoveis (2026-07-15)

Tabelas novas, leitura pública (RLS `select using (true)`; escrita só via `service_role`):

| Tabela | Conteúdo |
|--------|----------|
| `site_sections` | `key` (`catalogo`/`resultados`/`notas_apps`/`depoimentos`) + `visible` |
| `resultado_cards` | 4 linhas fixas (ícone, valor, legenda) |
| `app_ratings` | 3 linhas fixas (plataforma, nota, máximo, texto exibido) |
| `depoimentos` | Lista dinâmica (nome, origem, texto) — admin pode adicionar e remover |

`/admin/pagina-imoveis` — uma tela com switch de visibilidade + campos editáveis para cada seção, botão único "Salvar alterações" (`saveSiteConfig`). `/imoveis` lê tudo isso via `src/lib/site-content.ts` (`getImoveisPageContent`, client anon — RLS permite leitura pública).

Achado e corrigido durante o teste: o botão "Remover" depoimento só tirava a linha do estado local; o backend esperava uma flag `_delete` que o cliente nunca enviava, então nada era apagado de verdade. Corrigido calculando a diferença entre os IDs enviados e os que existem no banco.

### ✅ SC-023 — Admin da página /parceiros (2026-07-15)

Mesmo padrão do SC-021, reaproveitando a tabela `site_sections` (chaves prefixadas `parceiros_*` pra não colidir com as de `/imoveis`). `/admin/pagina-parceiros` — só controla visibilidade (liga/desliga), sem edição de texto/conteúdo (não foi pedido nessa rodada).

**12 blocos controláveis** — todos exceto o hero, que fica fixo por pedido explícito: Faixa de plataformas, O Problema, A Solução, O Que Fazemos, CTA intermediário, Valor para quem é dono, Como Funciona, Resultados, Receba uma proposta (formulário), Perguntas Frequentes, Rodapé/Contato, Botão flutuante do WhatsApp.

`src/lib/parceiros-content.ts` (leitura pública) / `src/lib/parceiros-content.server.ts` (`getAdminParceirosSections`/`saveParceirosSections`, protegidos por `requireAdminMiddleware`).

**✅ Corrigido (2026-07-15):** os links do menu do header (`__root.tsx`) apontavam para âncoras (`#problema`, `#faq` etc.) fixas, sem saber se a seção estava oculta — um bloco desligado no admin deixava o link correspondente do menu levando a lugar nenhum. Agora o `Header` lê o `loaderData` da rota `/parceiros` (via `useMatches()`, procurando a match com `routeId === "/parceiros"`) e filtra `PARCEIROS_NAV`/o botão "Fale Conosco" pelas mesmas flags de `site_sections` que a página usa — menu e conteúdo ficam sempre em sincronia.

---

### 🔧 SC-024 — Deploy em produção via Cloudflare Workers (2026-07-15)

HostGator (hospedagem compartilhada) não roda esse projeto — precisa de um servidor, não só arquivos estáticos (ver decisão registrada em conversa). Caminho escolhido: **Cloudflare Workers** (grátis, é o alvo de build que o projeto já usa por padrão via `@lovable.dev/vite-tanstack-config`), com deploy automático a cada push em `main`.

| O que | Detalhe |
|-------|---------|
| ✅ `npm run build` testado localmente | Gera `.output/server/` com o worker (`index.mjs`) + `wrangler.json` auto-gerado pelo Nitro (`nodejs_compat` ativado — necessário pro SDK do Supabase) |
| ✅ `.github/workflows/deploy.yml` | Roda em todo push pra `main` (+ disparo manual): `npm ci` → `npm run build` (injeta as `VITE_*` do GitHub Secrets) → `wrangler deploy` (via `cloudflare/wrangler-action`, Wrangler v4 fixado, rodando da raiz do repo) |
| ⏳ **`[PRECISA DE VOCÊ]`** Secrets no GitHub | `Settings → Secrets and variables → Actions`: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (opcional: `VITE_GA_ID`) — confirmado que já estão cadastrados (2026-07-16), mas o deploy ainda não chegou a testar a autenticação de verdade porque falhava antes por outro motivo (ver abaixo) |
| ⏳ **`[PRECISA DE VOCÊ]`** Secrets no Worker (Cloudflare, não GitHub) | Painel Cloudflare → Workers & Pages → o worker → Settings → Variables and Secrets: `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` — precisam existir aqui porque rodam no servidor a cada requisição, não no build |
| ⏳ Domínio customizado | Depois do primeiro deploy funcionar em `*.workers.dev`, falta apontar `scstays.com.br` (hoje no HostGator) pra Cloudflare — próximo passo, ainda não feito |
| ✅ Removida duplicidade de pipeline (2026-07-16) | O Worker `sc-stays` tinha a integração nativa "Workers Builds" (Connect to Git) ativa no Cloudflare, rodando em paralelo com o `deploy.yml` e falhando (não conhece a estrutura de saída do Nitro). Decisão: manter só o `deploy.yml` como fonte única do pipeline — é o único caminho que o Claude Code consegue inspecionar/depurar (sem acesso ao dashboard da Cloudflare). Desativado em Workers & Pages → sc-stays → Settings → Builds |

**✅ Corrigido (2026-07-16):** `npm ci` falhava no CI (`ci.yml`) e no `deploy.yml`, mas só nas branches do Dependabot — `npm error Missing: lru-cache@11.5.2 from lock file`. Causa: o Dependabot regenera `package-lock.json` com sua própria versão do npm (mais nova), incompatível com a validação estrita do `npm ci` na versão pinada no CI (a mesma reintrodução do problema já resolvido uma vez pro `main`, ver histórico de commits "Regenera package-lock.json..."). Em vez de regenerar o lockfile a cada PR do bot, fixei a versão do npm (`npm install -g npm@11.13.0`) direto nos workflows (`ci.yml` e `deploy.yml`, antes do `npm ci`) — testado localmente contra o `main` e as 5 branches do Dependabot, `npm ci` limpo em todas.

**✅ Corrigido (2026-07-16):** com o `npm ci` resolvido, o deploy chegou até o step do Wrangler e falhou com `Missing entry-point` — não era secret ausente. Causa real (lida no log bruto do Actions): o `cloudflare/wrangler-action@v3` instala por padrão a versão **3.90.0** do Wrangler (bem mais antiga que a atual, 4.111.0), que não sabe ler `wrangler.json` (só `wrangler.toml`) — então ignorava o config que o Nitro gera e reclamava de "entry-point ausente" mesmo com `main: "index.mjs"` presente no arquivo. Corrigido fixando `wranglerVersion: "4"` no step do wrangler-action e trocando `workingDirectory: .output/server` por rodar da raiz do repo (o Nitro gera um `.wrangler/deploy/config.json` na raiz apontando pro `wrangler.json` real em `.output/server` — o Wrangler 4 só resolve esse indireto corretamente rodando da raiz; de dentro de `.output/server` ele encontra os dois arquivos e dá erro de ambiguidade). Testado localmente com `npx wrangler@4 deploy --dry-run`, bundle gerado e validado com sucesso.

**✅ Corrigido (2026-07-16):** primeiro deploy publicado com sucesso, mas login e páginas internas do admin quebravam com `Error: supabaseUrl is required` (visível no console do navegador). Causa: `src/lib/supabase.server.ts` lia `process.env.VITE_SUPABASE_URL` (lookup em **runtime**), mas essa variável só existia como secret de **build** no GitHub Actions (`VITE_*` só é injetada durante `npm run build`, não fica disponível como variável do Worker no Cloudflare em tempo de requisição) — nunca foi cadastrada como variável do Worker. O client público (`src/lib/supabase.ts`) já usava `import.meta.env.VITE_SUPABASE_URL` corretamente (inlinado pelo Vite em build time). Corrigido trocando `supabase.server.ts` pro mesmo padrão (`import.meta.env` em vez de `process.env` pra essa variável específica) — confirmado no bundle gerado que o valor fica embutido como string literal, sem precisar de nenhuma variável nova no Cloudflare. `SUPABASE_SERVICE_ROLE_KEY` continua corretamente como `process.env` (secret real, não pode ser inlinado no bundle público).

---

### ✅ GitHub — Boas práticas (já implementado)

| O que | Arquivo | Detalhe |
|-------|---------|---------|
| ✅ `.env` protegido | `.gitignore` | Adicionado `.env` e `.env.*`; chaves nunca vão para o repo |
| ✅ Template de variáveis | `.env.example` | Arquivo seguro com todas as vars necessárias (sem valores reais) |
| ✅ CI — TypeScript | `.github/workflows/ci.yml` | Roda `tsc --noEmit` em todo push e PR para main |
| ✅ Dependabot | `.github/dependabot.yml` | PRs automáticos toda segunda com atualizações de segurança |

### ⏳ GitHub — Requer ação sua no painel

**Branch protection em `main`** — `Settings → Branches → Add rule`:
- Branch name: `main`
- ✅ Require status checks to pass → selecione `TypeScript`
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings

**Secrets para deploy** — `Settings → Secrets and variables → Actions` (adicionar quando Supabase estiver configurado):
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
```

---

## Resumo executivo das pendências

| Prioridade | Item | Quem |
|-----------|------|------|
| 🔴 Alta | Configurar secrets de deploy no GitHub + no Worker (SC-024) | Você — passo a passo na conversa |
| 🔴 Alta | Trocar senha do admin por uma forte antes de deploy (`.env` → `ADMIN_PASSWORD`) | Você |
| 🔴 Alta | Storage bucket + fotos reais dos imóveis (SC-008) | Dev |
| 🟡 Média | Apontar domínio `scstays.com.br` (HostGator) pra Cloudflare | Você + Dev, depois do 1º deploy funcionar |
| 🟡 Média | Branch protection no GitHub | Você (5 min no painel) |
| 🟡 Média | Preencher conteúdo real de Resultados/Avaliações/Depoimentos | Você mesmo, em `/admin/pagina-imoveis` |
| 🟡 Média | Métricas reais de `/parceiros` | Você coleta → Dev implementa (ainda não é admin-editável) |
| 🟢 Baixa | Google Analytics (GA4) | Você cria conta → Dev ativa |
| 🟢 Baixa | Google Business Profile | Você |
| 🟢 Baixa | Seção "Quem Somos" | Você envia foto/bio → Dev implementa |
| 🟢 Baixa | OG Image 1200×630 | Designer |
