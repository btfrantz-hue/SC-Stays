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
| ✅ Fotos do Storage | `src/lib/property-images.ts` | Upload e ordenação por imóvel no admin (SC-008). `property-image-fallback.ts` só entra pra imóvel que ainda **não** tem foto |

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

### 🔴 AUDITORIA 2026-08-30 — o que este doc dizia vs. o que o ambiente diz

Tudo abaixo foi **verificado em execução** (Git, API REST do Supabase com a service role key, `curl` no domínio e no Vercel, dev server local na porta 5173). Não é inferência a partir do texto deste arquivo.

#### 1. 🔴 O trabalho de agosto nunca chegou em `main` — nada dele está publicado

`chore/deps-integration` está **8 commits à frente de `scstays/main`**:

| Commit | Entrega |
|--------|---------|
| `560e1e0` | SC-027 — conteúdo de `/parceiros` no admin |
| `7a65e43` | SC-008 — fotos dos imóveis no Supabase Storage |
| `f005013` | `routeTree.gen.ts` regenerado |
| `238999e` `9d59deb` `8c985b2` `befbd8d` | SC-026 — os 5 PRs do Dependabot |
| `487f397` | SC-025 — migração do deploy para o Vercel |

`.github/workflows/deploy.yml` dispara em `push: branches: [main]`. E `scstays/main` **ainda tem o `vite.config.ts` com o preset Cloudflare** — `main` é anterior ao SC-025. Consequência: SC-008, SC-025, SC-026 e SC-027 estão prontos, testados e **fora do caminho de publicação**. Este doc os marcava como concluídos sem registrar que viviam só numa branch.

#### 2. 🔴 A migration do SC-027 continua não aplicada

```
parceiros_resultados   -> HTTP 404 (a tabela não existe)
parceiros_depoimentos  -> HTTP 404 (a tabela não existe)
site_sections          -> 16 linhas, sem a chave `parceiros_depoimentos`
```

Efeito medido no dev server local: `/parceiros` responde 200, mas o HTML servido tem **`id="resultados"` → 0 ocorrências**. O bloco Resultados desaparece sem erro visível — `getParceirosContent()` engole a falha em `?? []` (`src/lib/parceiros-content.ts:101`) e `parceiros.tsx:512` tem guarda `resultados.length > 0`. `/admin/pagina-parceiros` abre, mas falha ao salvar.

#### 3. 🟠 `property_images` tem 0 linhas — nenhum imóvel tem foto real

Os 3 imóveis ativos estão todos no fallback genérico. Confirmado no HTML de `/imoveis`: os 3 slugs aparecem, e `property-images` (URL do Storage) → **0 ocorrências**. O upload do SC-008 funciona e nunca foi usado.

#### 4. 🟠 O domínio segue no HostGator

`www.scstays.com.br` → `Server: Apache`, HTML estático. `/imoveis` → **404**. Sem mudança desde 2026-08-09.

#### 5. 🟡 O que está no ar no Vercel é código anterior ao merge

`graphic-to-site-glow.vercel.app` (projeto `prj_Sx8L5VmlgEJzm9mY95G3vZadzCEK`) responde `/`, `/parceiros`, `/imoveis`, `/imoveis/$slug` e `/admin/login` → **200**; `/admin` → **303**. Funciona — mas sem SC-008 e sem SC-027. Como `main` não tem o SC-025, esse deploy **não saiu do `deploy.yml`**: veio de um deploy manual ou da integração Git nativa do Vercel, que o próprio SC-025 pede para desconectar. Vale checar antes de mergear.

#### 6. 🟡 Quatro seções estão desligadas no admin

`depoimentos` (de `/imoveis`), `parceiros_problema`, `parceiros_solucao` e `parceiros_valor_dono` com `visible = false`. Pode ter sido intencional — vale reconferir.

#### 7. 🟡 Dois remotes divergentes

`origin` = `crobertofrantz-netizen/graphic-to-site-glow` · `scstays` = `btfrantz-hue/SC-Stays`. As duas `main` divergiram (origin tem 1 commit que scstays não tem; scstays tem 5 que origin não tem). Os secrets do SC-025 apontam para `btfrantz-hue/SC-Stays`, então **scstays é o canônico** — mas `origin` é o remote padrão do push, o que é uma armadilha real na hora de mergear. A branch `homolog` está 27 commits atrás e não serve de staging.

#### ✅ O que a auditoria confirmou intacto

`properties` 3 ativos · `site_sections` 16 · `resultado_cards` 4 · `app_ratings` 3 · `depoimentos` 3 · `proposal_leads` **0** (nenhum lead real ainda) · `whatsapp_clicks` 2 (testes). `.env` local com as 7 variáveis. Node 24.16 / npm 11.13.0 (bate com o pin dos workflows). Dev server local sobe limpo e as 12 rotas respondem o esperado (200 nas públicas, 303 nas de admin sem sessão).

---

### ⏳ Conteúdo para substituir os mocks

**`[PRECISA DE VOCÊ]`** — os itens de `/imoveis` (Resultados, Avaliações, Depoimentos) agora você mesmo edita em `/admin/pagina-imoveis`, sem precisar pedir pro dev. Falta só:

| Item | O que enviar | Onde aparece |
|------|-------------|--------------|
| Métricas reais para `/parceiros` | Taxa de ocupação, aumento de receita %, nota média, nº de imóveis | ✅ Agora é você quem preenche, em `/admin/pagina-parceiros` → Resultados (SC-027) |
| Depoimentos de proprietários | Nome, cidade, texto sobre gestão | ✅ Agora é você quem cadastra, em `/admin/pagina-parceiros` → Depoimentos (SC-027) |
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

O arquivo **existe**, mas é o provisório: cópia byte a byte de `src/assets/hero-living.jpg` (mesmos 165.028 bytes, mesma data de modificação). Serve pra não quebrar o preview em redes sociais, mas não é uma peça de marca — é uma foto de sala sem logo, sem tagline e nas proporções erradas.

**Spec para o designer:** 1200 × 630 px · paleta cream / verde `#054839` / dourado `#D3AF37` (nova identidade, ver "Identidade visual — rebranding" acima) · logo + tagline + foto ao fundo · substituir `public/og-image.jpg`

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

### ✅ SC-008 — Storage de imagens dos imóveis (2026-08-09)

**O diagnóstico era maior que "falta o bucket".** A tabela `property_images` existia desde o SC-007, mas **não era lida nem escrita em nenhuma linha do código** — `public-properties.ts` colava `FALLBACK_IMAGES` em todo registro, nas duas funções. Então todo imóvel do catálogo mostrava as mesmas 3 fotos genéricas.

| O que | Detalhe |
|-------|---------|
| ✅ Bucket `property-images` | Criado: público, limite de 5 MB por arquivo, MIME restrito a `image/jpeg`, `image/png`, `image/webp` |
| ✅ Sem migration de policy | Bucket público ⇒ leitura via URL pública sem policy; escrita só por `service_role`, que ignora RLS. Não precisou de SQL |
| ✅ `src/lib/property-images.ts` | Novo. Constantes do bucket, limites, `propertyImageUrl()`, `sortPropertyImages()` (capa primeiro, depois `sort_order`) e `imageExtension()`. Sem imports server-only — é usado pelo catálogo público e pelo admin |
| ✅ Server functions em `properties.server.ts` | `listAdminPropertyImages`, `createPropertyImageUploadUrl`, `addPropertyImage`, `deletePropertyImage`, `setPropertyImageCover`, `reorderPropertyImages` — todas com `.middleware([requireAdminMiddleware])` |
| ✅ `src/components/admin/property-images-manager.tsx` | Novo. Upload múltiplo, grid com preview, reordenar (setas), definir capa (estrela) e remover (com `AlertDialog` de confirmação) |
| ✅ `admin.imoveis.$id.tsx` | Renderiza o gerenciador **fora** do `<form>` — cada ação de foto salva na hora, os campos de texto só no "Salvar imóvel" |
| ✅ `public-properties.ts` | `PUBLIC_COLUMNS` faz join com `property_images`; `FALLBACK_IMAGES` virou fallback só pra imóvel **sem** foto. `imoveis.tsx` e `imoveis.$slug.tsx` não mudaram — já consumiam `property.images: string[]` |
| ✅ `deleteAdminProperty` | Passou a apagar os objetos do Storage antes de excluir o imóvel. O `on delete cascade` cuida das linhas de `property_images`, mas Storage não tem cascade — os arquivos ficariam órfãos pra sempre |

**Bytes não passam pela server function.** O admin pede uma signed upload URL (`createPropertyImageUploadUrl`, protegida), o browser faz o PUT direto no Supabase Storage e depois só registra o caminho (`addPropertyImage`). O caminho é gerado no servidor (`<property_id>/<uuid>.<ext>`) — o nome do arquivo enviado pelo usuário nunca entra num path de storage. Evita empurrar payloads de 5 MB pelo runtime SSR e mantém a escrita autenticada.

**Fotos só na tela de edição.** O upload precisa do id do imóvel pra montar o path, e na tela de criação ele ainda não existe. `/admin/imoveis/novo` mostra um aviso explicando que as fotos entram depois de salvar.

**Testado contra o banco real (camada de dados e catálogo público):** signed URL gerada → upload dos bytes → linha criada → URL pública devolveu 200 `image/jpeg` com os bytes idênticos aos enviados → `/imoveis` e `/imoveis/$slug` passaram a renderizar a foto do Storage no lugar do fallback, enquanto os outros dois imóveis (sem foto) continuaram no fallback (conferido que a página de detalhe emite **uma** `<img>` de imóvel, a real). Também verificado que o join sai limpo com a **chave anon** — a RLS pública permite. A imagem de teste foi removida do banco e do bucket depois; zero resíduo, bucket vazio.

**⚠️ Não verificado em execução: a tela do admin.** `/admin/imoveis/$id` exige sessão, e nesta sessão de trabalho não havia browser automatizado disponível. O que garante a tela: `tsc --noEmit` limpo, `eslint` sem erros nos arquivos novos, `npm run build` passando, e o fato de o loader/`router.invalidate()`/`AlertDialog` seguirem exatamente o padrão já em produção nas outras telas admin. **Vale um clique manual** em `/admin/imoveis/<imóvel>` na primeira vez que subir fotos: enviar 2 fotos, trocar a capa, reordenar e remover uma.

**`[PRECISA DE VOCÊ]`** — subir as fotos reais de cada imóvel em `/admin/imoveis/<imóvel>`. Enquanto um imóvel não tiver nenhuma, ele continua no fallback genérico. Quando todos tiverem, `src/lib/property-image-fallback.ts` e os 3 assets podem ser removidos.

**🟠 Status em 2026-08-30: `property_images` tem 0 linhas.** Nenhuma foto foi subida ainda — os 3 imóveis do catálogo estão todos no fallback genérico. Confirmado no HTML de `/imoveis`: `property-images` (URL do Storage) → 0 ocorrências. A funcionalidade está pronta e nunca foi exercitada com conteúdo real; o clique manual de validação sugerido acima continua valendo.

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

### ⚠️ SC-024 — Deploy via Cloudflare Workers (2026-07-15) — **SUBSTITUÍDO PELO SC-025**

> **Histórico.** Este bloco descreve a plataforma antiga. Desde 2026-08-09 o alvo de deploy é o **Vercel** — ver SC-025 logo abaixo. Fica registrado porque os bugs resolvidos aqui explicam decisões que ainda valem (pipeline único, secret de build vs. de runtime) e porque a análise de "por que HostGator não serve" continua válida.

HostGator (hospedagem compartilhada) não roda esse projeto — precisa de um servidor, não só arquivos estáticos (ver decisão registrada em conversa). Caminho escolhido **na época**: **Cloudflare Workers** (grátis, é o alvo de build que o projeto já usa por padrão via `@lovable.dev/vite-tanstack-config`), com deploy automático a cada push em `main`.

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

**✅ Corrigido (2026-07-16, hoje irrelevante — era específico do Cloudflare):** mesmo com `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`ADMIN_SESSION_SECRET` cadastrados no Worker, o login continuava falhando. Causa raiz (achada lendo o handler gerado pelo Nitro em `.output/server/index.mjs`): o Cloudflare só copia o `env` do Worker (onde ficam as variáveis do dashboard) pra `globalThis.__env__` — nunca pra `process.env`. Por padrão, com só a flag `nodejs_compat`, `process.env` no Cloudflare só contém `NODE_ENV`; pra ele refletir as vars/secrets do Worker é preciso a flag adicional `nodejs_compat_populate_process_env` (feature própria do Cloudflare, exige `compatibility_date` ≥ 2025-04-01 — já temos). O Nitro não expõe essa flag por padrão nem tem opção documentada pra ela; setada via `nitro.cloudflare.wrangler.compatibility_flags` em `vite.config.ts` (opção não tipada no `@lovable.dev/vite-tanstack-config`, mas repassada de verdade pro nitro — usado `@ts-expect-error` documentado). Confirmado no `wrangler.json` gerado que as duas flags (`nodejs_compat` + `nodejs_compat_populate_process_env`) ficam presentes.

---

### ✅ SC-025 — Migração do deploy para o Vercel (2026-08-09, substitui o SC-024)

**O que aconteceu.** Em 2026-07-22 uma migração pro Vercel foi iniciada e ficou pela metade, **sem commit**: `vite.config.ts` com o preset trocado, `vercel.json` novo e `.vercel/` linkado no disco, mas o `deploy.yml` ainda publicando no Cloudflare. Nesse estado, qualquer push em `main` quebraria o deploy — o build com preset `vercel` não gera o `wrangler.json` que o Wrangler procura. O projeto ficou parado nessa inconsistência por 18 dias. Esta entrada fecha isso.

**Por que Vercel.** O deploy já estava no ar e funcionando lá, e a plataforma resolve nativamente o problema que custou mais tempo no Cloudflare: `process.env` é populado pelo runtime sem precisar de flag de compatibilidade nenhuma. O hack `nodejs_compat_populate_process_env` (ver SC-024) foi removido junto.

| O que | Detalhe |
|-------|---------|
| ✅ `vite.config.ts` | `nitro.preset: "vercel"`; bloco `cloudflare.wrangler` (e o `@ts-expect-error` que ele exigia) removidos. O build passa a escrever `.vercel/output` (Build Output API v3) em vez de `.output/server/` |
| ✅ `.github/workflows/deploy.yml` | Só o último step mudou. `npm install -g npm@11.13.0` → `npm ci` → `npm run build` (com as `VITE_*` dos GitHub Secrets) continuam iguais; o step do `cloudflare/wrangler-action` virou `npx vercel@latest deploy --prebuilt --prod`. Como o preset do Nitro já produz `.vercel/output`, o `--prebuilt` sobe o que a Action buildou — os builders do Vercel não rodam |
| ✅ `vercel.json` | `{"framework": "tanstack-start"}` |
| ✅ `.gitignore` | + `.vercel` (contém o link do projeto, não deve ir pro repo) |
| ✅ Verificado localmente | `npm run build` gera `.vercel/output/config.json` + `functions/__server.func/`, e **não** gera `.output/` nem `wrangler.json`. `tsc --noEmit` limpo |
| ⏳ **`[PRECISA DE VOCÊ]`** `VERCEL_TOKEN` | Vercel → Account Settings → Tokens (escopo no time `team_Ws2LQbQplAcIxtcLUC1v4Ewj`) → cadastrar em `btfrantz-hue/SC-Stays` → Settings → Secrets and variables → Actions |
| ⏳ **`[PRECISA DE VOCÊ]`** Pipeline único | Vercel → projeto `graphic-to-site-glow` → Settings → Git: **se estiver conectado ao repositório, desconectar.** Mesma armadilha que o SC-024 já teve que resolver no Cloudflare (Workers Builds rodando em paralelo com o `deploy.yml`) |
| ⏳ **`[PRECISA DE VOCÊ]`** Higiene | Remover os secrets `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` do GitHub e apagar o Worker `crobertofrantz-netizen-graphic-to-site-glow` no painel da Cloudflare (opcional, só limpeza) |

**Variáveis de ambiente — build vs. runtime (a distinção que gerou os dois bugs do SC-024):**

| Tipo | Quais | Onde ficam | Por quê |
|------|-------|-----------|---------|
| **Build** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GA_ID` | GitHub Secrets (usados no step de build do `deploy.yml`) | O Vite inlina como string literal no bundle; não existem mais em tempo de requisição |
| **Runtime** | `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | Env do projeto no painel do Vercel (escopo Production) | São lidos via `process.env` a cada requisição. Secrets de verdade — nunca podem ser inlinados no bundle |

`ADMIN_SESSION_SECRET` já está configurado no Vercel — verificado em 2026-08-09: `/admin` responde **303 → /admin/login** em vez de 500, e `admin-session.ts` lança se a var faltar. Os outros três só um login de verdade confirma.

`src/lib/supabase.server.ts` continua com `import.meta.env.VITE_SUPABASE_URL` (build) + `process.env.SUPABASE_SERVICE_ROLE_KEY` (runtime) — a assimetria agora está comentada no próprio arquivo, não só aqui.

**Estado verificado da aplicação no Vercel (2026-08-09):** `/`, `/parceiros`, `/imoveis` e `/admin/login` respondem 200; `/imoveis` renderiza os 3 imóveis reais vindos do Supabase (`apartamento-beira-mar-ingleses`, `casa-lagoa-da-conceicao`, `flat-executivo-centro-florianopolis`).

---

### 🔴 Domínio `scstays.com.br` — ainda não aponta pra aplicação

Verificado em 2026-08-09: `www.scstays.com.br` responde `Server: Apache` (HostGator), servindo um **HTML estático de 2026-07-09** — ainda com `lang="en"`, anterior ao rebranding e a todo o trabalho de julho. `/imoveis`, `/parceiros` e `/admin/login` retornam **404**.

Ou seja: catálogo, painel admin, captura de leads e SEO existem, funcionam, mas **estão invisíveis pra quem acessa o site pelo domínio real**. Enquanto o DNS não for apontado pro Vercel, a aplicação só existe na URL da plataforma.

`[PRECISA DE VOCÊ]` — decisão adiada por escolha sua nesta rodada. Quando for a hora: adicionar o domínio em Vercel → projeto → Settings → Domains e trocar os registros DNS no painel onde o domínio está hoje.

---

### ✅ SC-026 — Atualização de dependências: os 5 PRs do Dependabot (2026-08-09)

Cinco PRs estavam abertos e parados desde julho. Todos foram testados localmente contra o código atual (não contra a base antiga em que o Dependabot os criou) e **todos passaram**: `npm ci`, `tsc --noEmit`, `npm run build` e render SSR de `/`, `/parceiros`, `/imoveis`, `/imoveis/$slug` e `/admin/login` sem nenhum erro.

| PR | Bump | Resultado |
|----|------|-----------|
| #8 | grupo minor/patch — 43 pacotes (Radix, React 19.2.0→19.2.8, Supabase, TanStack, Tailwind) | ✅ limpo |
| #4 | `lucide-react` 0.575 → **1.24** (major) | ✅ limpo — ver nota do CI vermelho abaixo |
| #2 | `zod` 3.24 → **4.4** (major) | ✅ limpo — ver nota dos schemas abaixo |
| #5 | `@vitejs/plugin-react` 5.2 → **6.0** (major) | ✅ limpo |
| #3 | `eslint-plugin-react-hooks` 5.2 → **7.1** (major) | ✅ limpo |

**O CI vermelho do #4 era falso alarme.** A branch foi criada antes do commit `acb79a4` (que fixou `npm install -g npm@11.13.0` nos workflows), então o CI dela rodava o workflow **antigo** e quebrava no `npm ci` — o mesmo problema de lockfile já documentado no SC-024, nada a ver com o lucide. O `lucide-react` v1 removeu os ícones de marca, e o `Instagram` que `/parceiros` usava foi substituído por um SVG inline no commit `9427a3d` (2026-07-16), que já estava na branch do PR e veio junto.

**`zod` 4 foi validado em runtime, não só no typecheck** — mudança de major em biblioteca de validação não se prova com `tsc`. Todos os schemas do projeto foram executados contra a v4.4.3 (`admin-auth.server.ts`, `leads.server.ts`, `properties.server.ts`, `site-content.server.ts`, `parceiros-content.server.ts`): `z.object` dinâmico via `Object.fromEntries`, `z.string().email()` (aceita válido, rejeita inválido), `.optional().default("")`, `z.enum`, `z.number().int().nonnegative()`, `z.array`, `z.record(z.string(), z.boolean())` — todos passaram. O `z.record` já estava na forma de 2 argumentos que a v4 exige.

**Como foram integrados:** os lockfiles dos 5 PRs conflitam entre si (é o esperado — cada um regenera o arquivo inteiro). Em vez de mergear um a um e brigar com conflito, a branch `chore/deps-integration` parte do #8, traz o fix do Instagram por cherry-pick, sobe os 4 majors direto no `package.json` e **regenera o lockfile do zero**. O `npm` local é o **11.13.0**, exatamente o pin dos workflows — foi conferido antes, justamente pra não reintroduzir o descompasso de versão que já causou os commits `ecbe4ef`/`41b1854`. `npm ci` valida o lockfile gerado.

**Sobra conhecida:** `npm audit` acusa 2 vulnerabilidades high transitivas (`js-yaml` ≤4.3.0 e `brace-expansion`), nenhuma introduzida por esses PRs. São de consumo quadrático de CPU em parsing — o app não faz parse de YAML nem de glob vindo do usuário, então o risco prático é baixo. Ficam pro Dependabot resolver quando houver versão corrigida upstream.

---

### ✅ SC-027 — Conteúdo de `/parceiros` no admin (2026-08-10)

O SC-023 tinha deixado `/parceiros` com só a **visibilidade** dos blocos editável — todo o texto seguia hardcoded. Duas pendências deste doc dependiam disso ("Métricas reais para `/parceiros`" e "Depoimentos de proprietários"), ambas paradas desde julho esperando um dev. Agora você preenche sozinho.

| O que | Detalhe |
|-------|---------|
| ✅ `parceiros_resultados` | 4 linhas fixas (`icon_key`, `valor`, `label`, `sort_order`) — só edita, não adiciona/remove. Espelha `resultado_cards` |
| ✅ `parceiros_depoimentos` | Lista dinâmica (`nome`, `cidade`, `texto`, `sort_order`). Separada de `depoimentos`, que é de hóspedes em `/imoveis` — misturar exigiria filtro em toda query |
| ✅ Chave `parceiros_depoimentos` em `site_sections` | Seção nova; entra **desligada**, porque sem depoimento cadastrado ela ficaria vazia |
| ✅ `parceiros-content.ts` | `getParceirosSections()` virou `getParceirosContent()`, devolvendo `{ sections, resultados, depoimentos }` |
| ✅ `parceiros-content.server.ts` | `getAdminParceirosContent`/`saveParceirosContent`, ambos com `requireAdminMiddleware` |
| ✅ `/admin/pagina-parceiros` | De 73 para ~250 linhas: blocos de edição de Resultados e Depoimentos + a lista de liga/desliga dos demais, um botão "Salvar alterações" |
| ✅ `__root.tsx` | O `Header` lia o `loaderData` de `/parceiros` como um mapa de booleans direto; com o shape novo passou a ler `.sections`. Entrada nova em `PARCEIROS_NAV` para a âncora `#depoimentos` |

**`valor` é opcional de propósito.** O bloco Resultados de `/parceiros` é qualitativo (ícone + legenda, sem número). Com `valor` vazio a página renderiza igual a antes; preenchendo, o número aparece em destaque acima da legenda. Isso permitiu subir a seção **sem** depender das métricas reais existirem — que era exatamente o que travava esse item.

**Primeira migration versionada.** `supabase/migrations/sc027_parceiros_content.sql`. Até aqui o schema só existia no banco remoto (sc007, sc010, sc021, sc023 foram aplicadas direto), o que é frágil. O arquivo é idempotente.

**⚠️ Ordem obrigatória: aplicar a migration ANTES de publicar.** Sem as tabelas, `getParceirosContent()` devolve listas vazias — a seção Resultados some da página (há guarda de `length > 0`, então não quebra, mas some).

> **`[PRECISA DE VOCÊ]` — aplicar o SQL.** Não dá para criar tabela pelo Claude Code neste projeto: o conector MCP do Supabase está autorizado numa conta que só enxerga o projeto `studio3dapplication`, não o `zeiauwvkfgibysayvhxu`, e a API REST com a service role key faz DML mas não DDL (nenhuma RPC de SQL exposta — verificado). Colar o arquivo no SQL Editor do Supabase resolve. Reautorizar o conector na conta certa também, e passa a valer pras próximas.
>
> **🔴 Status em 2026-08-30: confirmado NÃO aplicado.** `parceiros_resultados` e `parceiros_depoimentos` respondem **HTTP 404** na API REST, e `site_sections` segue com 16 chaves (sem `parceiros_depoimentos`). Efeito verificado no dev server: `/parceiros` renderiza sem o bloco Resultados (`id="resultados"` → 0 ocorrências no HTML). Ver a auditoria no topo da Parte 2.

**Não verificado em execução:** `/parceiros` e `/admin/pagina-parceiros` com dados reais, porque as tabelas ainda não existem. Cobertos por `tsc --noEmit` limpo, `eslint` sem erros e `npm run build` passando. O roteiro de teste está no plano da sessão.

---

### ✅ SC-028 — Destravamento do pipeline (2026-08-30)

Sessão dedicada a executar o Bloco 1 do backlog até onde não depende de painel externo.

| O que | Detalhe |
|-------|---------|
| ✅ Árvore verificada | `npx tsc --noEmit` exit 0 · `npm run build` exit 0, gerando `.vercel/output` e **nenhum** `wrangler.json` |
| ✅ PR #12 aberto | `chore/deps-integration` → `main`, com os 8 commits de agosto + a revisão do backlog. `mergeable: MERGEABLE`, `mergeStateStatus: CLEAN`, check `TypeScript` **pass**. Aberto em vez de push direto porque o token `gh` local não tem escopo `workflow` e o merge altera `.github/workflows/deploy.yml` |
| ✅ Branch protection em `main` | Via API: `required_status_checks` = `TypeScript` com `strict: true`, `enforce_admins: true`, force-push e deleção bloqueados. **Sem** exigência de review aprovado — o repo é de um dono só, exigir revisor travaria o merge |
| ✅ Secrets do Cloudflare removidos | `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` apagados do GitHub. Restam só `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. Era mais que higiene: `main` ainda tem o `deploy.yml` do Cloudflare, então um push acidental publicaria no alvo errado — sem os secrets ele apenas falha |
| ✅ PR #11 avaliado | Ver abaixo |
| ❌ Migration do SC-027 | Continua bloqueada. Reconfirmado nesta sessão: `mcp__claude_ai_Supabase__list_projects` devolve **só** `studio3dapplication` — o projeto `zeiauwvkfgibysayvhxu` não aparece na conta autorizada |

#### 🔴 Achado — são DOIS projetos Vercel, não um pipeline duplicado

O SC-025 registrou o risco como "integração Git rodando em paralelo com o `deploy.yml`". A realidade é pior. O CI do PR #12 revelou:

| Projeto | ID | Quem publica nele |
|---------|-----|-------------------|
| `sc-stays` | `prj_LuXIV3EXAvigGww1ohUdGedTT96R` | A **integração Git nativa**, que está ligada e buildou o PR #12 |
| `graphic-to-site-glow` | `prj_Sx8L5VmlgEJzm9mY95G3vZadzCEK` | O `deploy.yml`, via `VERCEL_PROJECT_ID` |

Não são dois caminhos para o mesmo site: são **alvos diferentes**. Isso explica por que `graphic-to-site-glow.vercel.app` serve código velho — quem vinha publicando era a integração Git, no outro projeto. Antes de mergear é preciso decidir **qual dos dois é o site de verdade** e desligar o outro; apontar o domínio (Bloco 3) para o projeto errado seria fácil demais.

**Consequência prática para a ordem de merge:** como a integração Git está ativa, mergear o PR #12 **publica** — o `VERCEL_TOKEN` ausente não protege nada. A migration ter de vir antes deixa de ser recomendação e vira pré-requisito.

O preview do PR existe (`sc-stays-git-chore-deps-integration-studio3d.vercel.app`) mas está atrás do Vercel SSO (`302 → vercel.com/sso-api`), então só abre logado — não deu para validar o conteúdo por fora.

#### ✅ PR #11 do Dependabot — avaliado e aprovado (não integrado)

PR aberto em 24/08 com 47 bumps, criado sobre a `main` antiga. Comparado pacote a pacote com a árvore atual: **35 já estavam cobertos** pelo SC-026 e em 4 a nossa árvore está **à frente** (`lucide-react` 1.24 vs 0.575, `zod` 4.4.3 vs 3.24.2, `@vitejs/plugin-react` 6.0.3 vs 5.2.0, `eslint-plugin-react-hooks` 7.1.1 vs 5.2.0 — todos os majors do SC-026).

Sobram **12 bumps reais**, todos minor/patch:

| dependencies | devDependencies |
|---|---|
| `@hookform/resolvers` ^5.5.7→^5.9.1 · `@supabase/supabase-js` ^2.111.0→^2.112.3 · `@tanstack/react-router` ^1.170.16→^1.170.31 · `@tanstack/react-start` ^1.168.34→^1.168.48 · `input-otp` ^1.4.2→^1.5.0 · `react-hook-form` ^7.83.0→^7.85.0 · `react-resizable-panels` ^4.6.5→^4.12.3 · `sonner` ^2.0.7→^2.0.8 | `@lovable.dev/vite-tanstack-config` 2.8.3→**2.15.1** · `eslint-plugin-react-refresh` ^0.5.3→^0.5.4 · `typescript-eslint` ^8.65.0→^8.67.0 · `vite` ^8.2.0→^8.2.2 |

Testados num git worktree isolado (não na árvore de trabalho), no mesmo padrão do SC-026: `npm install` → `npm ci` valida o lockfile → `tsc --noEmit` exit 0 → `npm run build` exit 0 → dev server SSR com as 5 rotas públicas em 200 e os 3 imóveis vindos do Supabase → 0 erros no log.

**O bump que merecia atenção era `@lovable.dev/vite-tanstack-config` 2.8.3 → 2.15.1** — 7 minors no pacote que controla o preset do Nitro, do qual o SC-025 depende. Verificado explicitamente: o build segue gerando `.vercel/output` e **não** gera `wrangler.json`, ou seja, o override do preset continua valendo.

Não integrado nesta sessão por escopo (o pedido foi avaliar). Quando for: mesmo caminho do SC-026 — aplicar os 12 no `package.json` e regenerar o lockfile com npm 11.13.0.

---

### ✅ GitHub — Boas práticas (já implementado)

| O que | Arquivo | Detalhe |
|-------|---------|---------|
| ✅ `.env` protegido | `.gitignore` | Adicionado `.env` e `.env.*`; chaves nunca vão para o repo |
| ✅ Template de variáveis | `.env.example` | Arquivo seguro com todas as vars necessárias (sem valores reais) |
| ✅ CI — TypeScript | `.github/workflows/ci.yml` | Roda `tsc --noEmit` em todo push e PR para main |
| ✅ Dependabot | `.github/dependabot.yml` | PRs automáticos toda segunda com atualizações de segurança |

### ⏳ GitHub — Requer ação sua no painel

**Branch protection em `main`** — ✅ **feito no SC-028 (2026-08-30)**, via API em vez do painel. Ativo hoje: check `TypeScript` obrigatório · `strict: true` (branch precisa estar atualizada) · `enforce_admins: true` (sem bypass, nem para o dono) · force-push e deleção bloqueados. Conferir com `gh api repos/btfrantz-hue/SC-Stays/branches/main/protection`.

**Secrets para deploy** — `Settings → Secrets and variables → Actions`. Só as de **build** vão aqui (ver a tabela build vs. runtime no SC-025):
```
VITE_SUPABASE_URL        ✅ cadastrado
VITE_SUPABASE_ANON_KEY   ✅ cadastrado
VITE_GA_ID               ⏳ opcional, ativa o GA4
VERCEL_TOKEN             ⏳ PENDENTE — sem ele o passo de deploy do workflow falha
CLOUDFLARE_API_TOKEN     🗑️ removido no SC-028
CLOUDFLARE_ACCOUNT_ID    🗑️ removido no SC-028
```

⚠️ **`VERCEL_TOKEN` ausente não impede a publicação.** A integração Git nativa do Vercel está ligada e publica no projeto `sc-stays` sem passar pelo workflow — ver o achado dos dois projetos no SC-028.
`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET` **não** vão no GitHub — são de runtime e ficam no painel do Vercel.

---

## Resumo executivo das pendências

_Reescrito em 2026-08-30, na ordem de dependência real — cada bloco destrava o seguinte. A ordem importa: adiantar o Bloco 2 sem o Bloco 1 significa cadastrar conteúdo que ninguém vê._

### Bloco 1 — destravar o que já está pronto mas invisível

**Estado em 2026-08-30 (SC-028): tudo o que não depende de painel externo está feito. O bloco inteiro trava no item 1.**

| # | Item | Quem | Status |
|---|------|------|--------|
| 1 | Aplicar `supabase/migrations/sc027_parceiros_content.sql` no SQL Editor (`zeiauwvkfgibysayvhxu`) | **Você** — 2 min | 🔴 **bloqueia 2 e 4** |
| 2 | Mergear `chore/deps-integration` → `main` | Você mergeia o PR | ⏸️ **PR #12 aberto, CI verde, esperando o item 1** |
| 3 | Cadastrar `VERCEL_TOKEN` em `btfrantz-hue/SC-Stays` → Settings → Secrets → Actions | **Você** | ⏳ pendente |
| 4 | **Decidir qual projeto Vercel é o site** (`sc-stays` vs. `graphic-to-site-glow`) e desligar o outro | **Você** | 🔴 pendente — é mais grave do que se pensava, ver SC-028 |

O item 4 mudou de natureza: não é "pipeline duplicado", são **dois projetos Vercel distintos** publicando de caminhos diferentes. Enquanto não for resolvido, mergear o PR #12 publica pela integração Git — por isso o item 1 tem de vir antes.

### Bloco 2 — conteúdo (só depende de você; todas as telas já existem)

| # | Item | Onde |
|---|------|------|
| 5 | Subir as fotos reais dos 3 imóveis — `property_images` está com 0 linhas | `/admin/imoveis/<imóvel>` |
| 6 | Métricas e depoimentos de proprietários | `/admin/pagina-parceiros` (depende do item 1) |
| 7 | Resultados / Avaliações / Depoimentos de hóspedes | `/admin/pagina-imoveis` |
| 8 | Revisar as 4 seções desligadas (`depoimentos`, `parceiros_problema`, `parceiros_solucao`, `parceiros_valor_dono`) | ambos os admins |

### Bloco 3 — ir ao ar de verdade

| # | Item | Quem |
|---|------|------|
| 9 | Apontar `scstays.com.br` pro Vercel (Settings → Domains + DNS no HostGator) | **Você** |

Enquanto o item 9 não acontece, catálogo, admin, captura de leads e SEO existem e funcionam, mas ninguém que digita o domínio real os vê. **Depois dele, o que estava planejado acaba.**

### Bloco 4 — encerramento (não bloqueia o lançamento)

| # | Item | Quem | Status |
|---|------|------|--------|
| 10 | Branch protection em `main` (exigir o check `TypeScript`) | Dev | ✅ **feito no SC-028** |
| 11 | `VITE_GA_ID` nos secrets → ativa o GA4 (conta já criada) | **Você** | ⏳ falta o valor do Measurement ID |
| 12 | OG Image 1200×630 de verdade — o `public/og-image.jpg` atual é cópia byte a byte do `hero-living.jpg` | Designer | ⏳ |
| 13 | Seção "Quem Somos" em `/parceiros` | Você envia foto/bio → Dev implementa | ⏳ falta foto e bio |
| 14 | Limpeza: secrets do Cloudflare no GitHub · apagar o Worker antigo | Dev / **Você** | ✅ secrets removidos no SC-028 · ⏳ Worker ainda existe na Cloudflare |
| 15 | Decidir o remote canônico (`scstays` vs. `origin`) e alinhar/arquivar o outro; a branch `homolog` está 27 commits atrás | Dev + você | ⏳ |
| 16 | Integrar os 12 bumps do PR #11 (avaliados e aprovados no SC-028) | Dev | ⏳ testado, não aplicado |

**Já resolvidos, saíram da lista:** secrets de build no GitHub (cadastrados e testados no SC-024/025) · senha forte do admin (trocada) · conta do Google Analytics (criada) · Google Business Profile (criado) · os 5 PRs do Dependabot (SC-026 — testados e integrados em `chore/deps-integration`, **ainda não em `main`**).
