# SC Stays Collection — Instruções para Claude Code

## Regra obrigatória: atualizar docs ao alterar código

**Sempre que modificar o código, atualizar `docs/MELHORIAS-PENDENTES.md`:**
- Novo recurso implementado → marcar como ✅ na tabela correspondente
- Seção mock ativada via feature flag → marcar item de "conteúdo pendente" como ✅
- Nova pendência identificada → adicionar na seção de pendências com prioridade
- Dado mock substituído por real → remover do bloco de mock pendente

O doc vive em `docs/MELHORIAS-PENDENTES.md`. Nunca deixar a sessão terminar sem o doc refletir o estado real do código.

---

## Feature flags

Seções com dados mock são controladas por `src/lib/feature-flags.ts`.

**Fluxo para ativar uma seção:**
1. Substituir o dado mock pela informação real no arquivo indicado no comentário do flag
2. Mudar o flag de `false` → `true` em `feature-flags.ts`
3. Marcar o item como ✅ em `docs/MELHORIAS-PENDENTES.md`

Flags atuais:
| Flag | Seção | Arquivo de dados |
|------|-------|-----------------|
| `RESULTADOS_IMOVEIS` | Resultados em `/imoveis` | `imoveis.tsx` → `RESULTADOS` |
| `NOTAS_APPS` | Avaliações Airbnb/Booking/Google em `/imoveis` | `imoveis.tsx` → `APP_RATINGS` |
| `DEPOIMENTOS_HOSPEDES` | Depoimentos de hóspedes em `/imoveis` | `imoveis.tsx` → `DEPOIMENTOS` |

---

## Stack e convenções principais

- **Framework:** TanStack Start (SSR) + TanStack Router v1 (file-based)
- **UI:** React 19 + Tailwind CSS v4 (`@theme` syntax) + shadcn/ui
- **Deploy:** Nitro → Cloudflare Workers (edge, sem filesystem)
- **Path alias:** `@/` → `src/`
- **Rotas:** nunca editar `routeTree.gen.ts` exceto quando o watcher não está ativo
- **Banco:** Supabase (ainda não configurado — SC-007/008)

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
| `/imoveis` | `routes/imoveis.tsx` | Catálogo público de imóveis |
| `/imoveis/$slug` | `routes/imoveis.$slug.tsx` | Detalhe do imóvel |

## Dados mock
- Imóveis: `src/lib/mock-properties.ts` — substituir por query Supabase no SC-013/014
- Seções de prova social: controladas por feature flags (ver acima)
