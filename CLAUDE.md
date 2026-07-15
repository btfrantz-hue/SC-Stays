# SC Stays Collection — Instruções para Claude Code

## Regra obrigatória: atualizar docs ao alterar código

**Sempre que modificar o código, atualizar `docs/MELHORIAS-PENDENTES.md`:**
- Novo recurso implementado → marcar como ✅ na tabela correspondente
- Seção mock ativada via feature flag → marcar item de "conteúdo pendente" como ✅
- Nova pendência identificada → adicionar na seção de pendências com prioridade
- Dado mock substituído por real → remover do bloco de mock pendente

O doc vive em `docs/MELHORIAS-PENDENTES.md`. Nunca deixar a sessão terminar sem o doc refletir o estado real do código.

---

## Conteúdo da página /imoveis (admin-editável)

Não existem mais feature flags estáticas para as seções de `/imoveis` — tudo vem do Supabase e é editado em `/admin/pagina-imoveis`:
| Tabela | Seção | Add/remove? |
|--------|-------|-------------|
| `site_sections` | visibilidade de `catalogo`/`resultados`/`notas_apps`/`depoimentos` | — |
| `resultado_cards` | 4 cards de métricas | não (linhas fixas, só texto/ícone editável) |
| `app_ratings` | notas Airbnb/Booking/Google | não (linhas fixas) |
| `depoimentos` | depoimentos de hóspedes | sim (admin adiciona/remove) |

Leitura pública: `src/lib/site-content.ts` (`getImoveisPageContent`, client anon, RLS `select using (true)`). Escrita: `src/lib/site-content.server.ts` (`getAdminSiteConfig`/`saveSiteConfig`, `service_role`, protegidos por `requireAdminMiddleware`).

## Visibilidade dos blocos da página /parceiros

Reaproveita a mesma tabela `site_sections`, com chaves prefixadas `parceiros_*` (12 blocos, todo o texto/conteúdo continua hardcoded em `parceiros.tsx` — só a visibilidade é admin-editável). **O hero é sempre visível, não tem chave/switch.** Editar em `/admin/pagina-parceiros`. Leitura pública: `src/lib/parceiros-content.ts` (`getParceirosSections`). Escrita: `src/lib/parceiros-content.server.ts`. Lista de chaves/labels: `PARCEIROS_SECTION_KEYS`/`PARCEIROS_SECTION_LABELS` em `parceiros-content.ts` — **novo bloco na página = adicionar a chave nesses dois lugares + inserir a linha em `site_sections` via migration + envolver o JSX com `{sections.<key> && (...)}`.**

---

## Stack e convenções principais

- **Framework:** TanStack Start (SSR) + TanStack Router v1 (file-based)
- **UI:** React 19 + Tailwind CSS v4 (`@theme` syntax) + shadcn/ui
- **Deploy:** Nitro → Cloudflare Workers (edge, sem filesystem)
- **Path alias:** `@/` → `src/`
- **Rotas:** nunca editar `routeTree.gen.ts` exceto quando o watcher não está ativo
- **Banco:** Supabase (`zeiauwvkfgibysayvhxu`, configurado — SC-007). Client browser: `src/lib/supabase.ts`. Client server (service role): `src/lib/supabase.server.ts`, só dentro de `createServerFn`
- **Admin:** `/admin/*` protegido por login próprio (`/admin/login`) com sessão em cookie selado (`src/lib/admin-session.ts`, `src/lib/admin-auth.server.ts`). Vars: `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`ADMIN_SESSION_SECRET`. **Toda server function admin deve ter `.middleware([requireAdminMiddleware])`** — o redirect de página em `src/start.ts` só cobre navegação, não as chamadas RPC em `/_serverFn/*`, que passam direto se a server function não tiver o middleware próprio
- **Gotcha do router:** rotas de arquivo com ponto (ex.: `admin.imoveis.novo.tsx`) viram filhas da rota pai (`admin.imoveis.tsx`) no TanStack Router. Se a rota pai tem um `loader` (lista de dados) e você navega pai → filha → pai de novo (ex.: criar/editar/excluir e voltar pra lista), o router **não** recarrega o loader do pai sozinho — o match "permanece" em vez de "entrar de novo". Sempre chamar `await router.invalidate()` antes do `navigate()` de volta, depois de qualquer mutação (ver `admin.imoveis.novo.tsx`/`admin.imoveis.$id.tsx`/`admin.imoveis.tsx`)

## Paleta de cores (tokens CSS)
- `cream` / `cream-deep` — fundos claros
- `navy` / `navy-deep` — fundos escuros, textos
- `gold` / `gold-soft` — destaque, bordas ativas
- `ink` / `muted-ink` — textos

## Rotas existentes
| URL | Arquivo | Descrição |
|-----|---------|-----------|
| `/` | `routes/index.tsx` | Home bifurcação (hóspede / proprietário) |
| `/parceiros` | `routes/parceiros.tsx` | Landing B2B para proprietários |
| `/imoveis` | `routes/imoveis.tsx` | Catálogo público de imóveis (`properties` com `status = 'active'`, via `src/lib/public-properties.ts`) |
| `/imoveis/$slug` | `routes/imoveis.$slug.tsx` | Detalhe do imóvel |
| `/admin` | `routes/admin.tsx` | Layout + dashboard admin |
| `/admin/login` | `routes/admin.login.tsx` | Login (username/senha → cookie de sessão) |
| `/admin/imoveis` | `routes/admin.imoveis.tsx` | Lista de imóveis (todos os status) — editar e excluir |
| `/admin/imoveis/novo` | `routes/admin.imoveis.novo.tsx` | Criar imóvel |
| `/admin/imoveis/$id` | `routes/admin.imoveis.$id.tsx` | Editar imóvel + visibilidade por campo |
| `/admin/pagina-imoveis` | `routes/admin.pagina-imoveis.tsx` | Visibilidade e conteúdo de Catálogo/Resultados/Avaliações/Depoimentos |
| `/admin/pagina-parceiros` | `routes/admin.pagina-parceiros.tsx` | Visibilidade dos 12 blocos de `/parceiros` (hero sempre visível) |
| `/admin/leads` | `routes/admin.leads.tsx` | Log + indicadores de propostas (`proposal_leads`) e cliques de WhatsApp (`whatsapp_clicks`), export CSV |

## Visibilidade de campos por imóvel
Coluna `properties.visible_fields` (jsonb) guarda overrides por campo (`{"amenities": false}` = oculto; chave ausente/`true` = visível). Campos controláveis definidos em `src/lib/property-fields.ts` (`CONTROLLABLE_FIELDS`) — só inclui campos que o catálogo/detalhe realmente renderizam. O admin (`src/components/admin/property-form.tsx`) mostra um checkbox "Visível no site" ao lado de cada campo controlável. `/imoveis` e `/imoveis/$slug` usam `isFieldVisible()` para decidir o que renderizar.

## Captura de leads
- `proposal_leads` — envios do formulário "Receba uma proposta" (`/parceiros`), via `submitProposalLead` (`src/lib/leads.server.ts`)
- `whatsapp_clicks` — cliques em qualquer botão de WhatsApp do site, via `trackWhatsappClick` (`src/lib/track-whatsapp-click.ts`) → `logWhatsappClick`. Novo ponto de CTA de WhatsApp = sempre adicionar `onClick={() => trackWhatsappClick({ page, button, propertySlug? })}`
- Ambas as tabelas: RLS habilitado, sem policy (só `service_role` acessa); leitura/escrita só via server functions
- Visualização + indicadores (KPIs, breakdown por origem) + export CSV: `/admin/leads`. Utilitário de CSV: `src/lib/csv.ts` (`toCsv`/`downloadCsv`)

## Dados mock
- Imóveis: migrados para Supabase (`src/lib/mock-properties.ts` removido)
- Imagens dos imóveis: `src/lib/property-image-fallback.ts` — fallback local temporário até o Storage bucket existir (SC-008)
- Resultados/Avaliações/Depoimentos de `/imoveis`: migrados para Supabase, admin-editáveis (ver seção acima)
- `/parceiros`: todo o texto continua hardcoded no componente; só a visibilidade dos blocos é admin-editável (ver seção acima)
