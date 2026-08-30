# SC Stays Collection — Regras para o MVP 1

## Escopo do MVP 1 (v0.3)

Este MVP é uma **vitrine de imóveis + contato via WhatsApp**. Não há reservas, datas, cotação, pagamento ou e-mails automáticos. Qualquer card que mencione essas funcionalidades pertence ao FUTURO-01 ou FUTURO-02.

## Stack

- **Framework:** TanStack Start (SSR) + TanStack Router (file-based)
- **UI:** React 19 + Tailwind CSS v4 + shadcn/ui (Radix)
- **Banco:** Supabase (PostgreSQL + Storage)
- **Build/Deploy:** Vite + Nitro (preset: Vercel)
- **Forms:** react-hook-form + zod

## Convenções de roteamento

- Rotas ficam em `src/routes/`
- `__root.tsx` é o shell global — não remover `<Outlet />`
- Rotas dinâmicas usam `$param` (ex: `imoveis/$slug.tsx`)
- Layout de admin: `admin/_layout.tsx` com Basic Auth no middleware
- `routeTree.gen.ts` é auto-gerado — NUNCA editar à mão

## Jornadas de usuário

```
/              → home com bifurcação
               ├── "Quero alugar"        → /imoveis
               └── "Quero ser parceiro"  → /parceiros
/parceiros     → landing institucional (B2B, proprietários)
/imoveis       → catálogo público de imóveis ativos
/imoveis/:slug → detalhe do imóvel + CTA WhatsApp
/admin/*       → painel protegido por Basic Auth
```

## Supabase

- Client browser: `src/lib/supabase.ts` (anon key, prefixo `VITE_`)
- Client servidor: `src/lib/supabase.server.ts` (service role, SEM prefixo `VITE_`)
- **NUNCA** usar service role key no client browser
- RLS habilitado: anon só vê imóveis com `status = 'active'`

## Variáveis de ambiente

```
VITE_SUPABASE_URL         ← público, client browser
VITE_SUPABASE_ANON_KEY    ← público, client browser
SUPABASE_SERVICE_ROLE_KEY ← privado, só createServerFn
ADMIN_USERNAME             ← privado, Basic Auth
ADMIN_PASSWORD             ← privado, Basic Auth
VITE_GA_ID                ← opcional, GA4
VITE_WA_NUMBER            ← número WhatsApp (só dígitos)
```

## Regras de implementação

- Imóveis sem `status = 'active'` não aparecem publicamente (RLS + verificação no detalhe)
- Catálogo não exibe preço, datas, disponibilidade ou botão de reserva
- WhatsApp pré-preenchido: mensagem geral em `/imoveis`, mensagem com nome do imóvel em `/imoveis/:slug`
- Botão WhatsApp flutuante NÃO aparece em `/admin/*`
- Header global (em `__root.tsx`) NÃO aparece em `/admin/*` — admin tem layout próprio
- Imagens de imóveis vêm do Supabase Storage, nunca de `src/assets/`
- A paleta de cores e fontes está em `src/styles.css` — usar tokens existentes

## O que já está implementado (não refazer)

- WhatsApp floating button (SC-015 ✅)
- WhatsApp mensagem pré-preenchida — geral (SC-016 parcial ✅)
- Landing institucional `/parceiros` — a ser criada a partir do `index.tsx` atual
- Documentação do escopo: `docs/SC-000-diagnostico.md`

## Componentes UI disponíveis (não instalar mais)

`table`, `form`, `input`, `textarea`, `select`, `dialog`, `badge`, `card`, `carousel`, `skeleton`, `sonner`, `accordion`, `button`, `label`, `separator`, `sheet`, `tabs` — todos em `src/components/ui/`
