# SC-000 — Diagnóstico Técnico e Arquitetura do MVP

> Status: ✅ Concluído
> Data: 2026-07-09

---

## 1. Stack confirmada

| Camada | Tecnologia | Versão | Observação |
|--------|-----------|--------|------------|
| Framework | TanStack Start | 1.168 | SSR habilitado (`ssr: true`) |
| Roteamento | TanStack Router | 1.170 | File-based, auto-gerado em `routeTree.gen.ts` |
| UI | React | 19 | |
| Estilo | Tailwind CSS | v4 | Via `@tailwindcss/vite`, sintaxe `@theme` no CSS |
| Build | Vite | 8 | Wrapper `@lovable.dev/vite-tanstack-config` |
| Servidor | Nitro | 3-beta | Target padrão: **Cloudflare Workers** |
| Estado servidor | TanStack Query | v5 | QueryClient no contexto do router |
| Formulários | react-hook-form + zod | ✓ | Já instalados, ainda não usados com shadcn/ui Form |
| Componentes UI | Radix UI + shadcn/ui | ✓ | Todos em `src/components/ui/` |
| Path alias | `@/` | → `src/` | Configurado no tsconfig e Vite |
| TypeScript | Strict | ES2022 | Bundler module resolution |
| Banco | — | — | **Não configurado. Supabase a instalar.** |
| Auth | — | — | **Não configurado.** |
| Storage | — | — | **Não configurado.** |
| Variáveis de ambiente | — | — | **Arquivo `.env` não existe.** |

---

## 2. Estrutura atual de arquivos relevantes

```
src/
├── routes/
│   ├── __root.tsx       ← shell: Header, layout global, JSON-LD, GA4
│   └── index.tsx        ← landing institucional (B2B — proprietários)
├── components/ui/       ← 30+ componentes shadcn/ui prontos
├── assets/              ← imagens estáticas (processadas pelo Vite com hash)
├── lib/
│   └── utils.ts         ← cn() helper
├── styles.css           ← Tailwind v4, tokens de cor e fonte da marca
├── router.tsx           ← cria router com QueryClient
├── server.ts            ← wrapper de erro SSR (não mexer)
└── start.ts             ← middleware Nitro (aqui vai o Basic Auth do admin)
public/
└── favicon.ico
```

---

## 3. Roteamento — como funciona e o que criar

TanStack Router usa **file-based routing**. Criar um arquivo cria uma rota. O `routeTree.gen.ts` é **auto-gerado** — nunca editar à mão.

### Rotas atuais
| Arquivo | URL |
|---------|-----|
| `routes/index.tsx` | `/` |

### Rotas a criar para o MVP 1
| Arquivo a criar | URL | Card |
|-----------------|-----|------|
| `routes/parceiros.tsx` | `/parceiros` | SC-006 (landing atual movida) |
| `routes/index.tsx` | `/` | SC-005 (nova home — bifurcação) |
| `routes/imoveis/index.tsx` | `/imoveis` | SC-013 |
| `routes/imoveis/$slug.tsx` | `/imoveis/:slug` | SC-014 |
| `routes/admin/_layout.tsx` | `/admin/*` | SC-009 (Basic Auth aqui) |
| `routes/admin/index.tsx` | `/admin` | — |
| `routes/admin/imoveis/index.tsx` | `/admin/imoveis` | SC-010 |
| `routes/admin/imoveis/novo.tsx` | `/admin/imoveis/novo` | SC-011 |
| `routes/admin/imoveis/$id.tsx` | `/admin/imoveis/:id` | SC-011 |

---

## 4. Target de deploy: Cloudflare Workers

O `vite.config.ts` usa `@lovable.dev/vite-tanstack-config` que configura Nitro com **Cloudflare Workers como target padrão**. Implicações:

- **Edge runtime** — sem filesystem persistente, sem `process.env` (usa `env` do handler)
- **Supabase client HTTP** — `@supabase/supabase-js` usa fetch puro, funciona perfeitamente
- **Basic Auth** — implementar no middleware do `start.ts` via `createMiddleware`, não via sessão/cookie tradicional
- **Variáveis de ambiente em produção** — configuradas no painel da Cloudflare/Lovable como secrets, não no `.env` (que é só para dev local)
- **Service role key do Supabase** — **NUNCA** prefixar com `VITE_` (ficaria exposta no bundle cliente). Usar em `createServerFn` apenas.

---

## 5. Banco de dados — Supabase (a instalar)

### Pacote
```bash
npm install @supabase/supabase-js
```

### Variáveis de ambiente necessárias (`.env`)
```env
# Supabase — cliente público (exposto no bundle)
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Supabase — service role (NUNCA com prefixo VITE_)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Admin Basic Auth
ADMIN_USERNAME=admin
ADMIN_PASSWORD=senha-segura-aqui

# Google Analytics (opcional)
VITE_GA_ID=G-XXXXXXXXXX

# WhatsApp
VITE_WA_NUMBER=5548991822477
```

### Arquivos de client a criar
```
src/lib/supabase.ts         ← client browser (anon key)
src/lib/supabase.server.ts  ← client server (service role, só em createServerFn)
```

### Schema mínimo de banco (SC-007)
```sql
-- Imóveis
create table properties (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  status      text not null default 'draft'
                check (status in ('draft', 'active', 'inactive')),
  name        text not null,
  short_desc  text,
  description text,
  neighborhood text,
  city        text not null default 'Florianópolis',
  state       text not null default 'SC',
  bedrooms    int,
  bathrooms   int,
  max_guests  int,
  amenities   text[],
  manager_name  text,
  manager_email text,
  manager_phone text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Imagens dos imóveis
create table property_images (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  storage_path text not null,
  is_cover    boolean default false,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- RLS: anon só vê imóveis ativos
alter table properties enable row level security;
create policy "public read active" on properties
  for select using (status = 'active');

alter table property_images enable row level security;
create policy "public read images of active" on property_images
  for select using (
    exists (
      select 1 from properties p
      where p.id = property_id and p.status = 'active'
    )
  );
```

---

## 6. Storage de imagens (SC-008)

Usar **Supabase Storage** (bucket `property-images`, público).

- Formatos aceitos: jpg, jpeg, png, webp
- Limite sugerido por upload: 5MB
- URL pública: `https://<projeto>.supabase.co/storage/v1/object/public/property-images/<path>`
- Fallback para Cloudinary não é necessário no MVP — cota gratuita do Supabase (1 GB) é suficiente

---

## 7. Autenticação admin (SC-009)

**Basic Auth via middleware Nitro** em `src/start.ts`.

- Protege qualquer rota que começa com `/admin`
- Credenciais em variáveis de ambiente (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)
- Funciona no edge runtime do Cloudflare Workers
- Sem sessão/cookie — stateless, adequado para MVP

---

## 8. Componentes existentes aproveitáveis

Os componentes em `src/components/ui/` cobrem todo o admin sem precisar instalar mais nada:

| Componente | Uso no MVP |
|-----------|------------|
| `table.tsx` | Listagem de imóveis no admin (SC-010) |
| `form.tsx` + `input.tsx` + `textarea.tsx` | Formulário de imóvel (SC-011) |
| `select.tsx` | Status, cidade, tipo |
| `dialog.tsx` | Confirmação de inativar/excluir |
| `badge.tsx` | Status do imóvel no catálogo e admin |
| `card.tsx` | Cards do catálogo público (SC-013) |
| `carousel.tsx` | Galeria de imagens no detalhe (SC-014) |
| `skeleton.tsx` | Loading states |
| `sonner.tsx` | Toasts de sucesso/erro |

---

## 9. Riscos mapeados

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| `@lovable.dev/vite-tanstack-config` é uma caixa preta — comportamento no build pode diferir do esperado | Médio | Testar build local antes de avançar para admin; não adicionar plugins duplicados |
| Cloudflare Workers tem limites de CPU por request (50ms em free tier) | Baixo | Supabase queries são rápidas; sem processamento pesado no edge |
| `routeTree.gen.ts` pode não auto-gerar se o watcher não estiver ativo | Baixo | Rodar `npm run dev` ao criar rotas novas |
| Imagens em `src/assets/` têm hash no nome após build — OG image precisa estar em `public/` | Já documentado | Ver MELHORIAS-PENDENTES.md item 12 |
| Constantes `SITE_URL`/`OG_IMAGE` declaradas entre imports em `__root.tsx` — inválido em ES modules | Baixo | Vite normaliza; não causa problema prático mas vale corrigir ao refatorar o arquivo |

---

## 10. Ordem de execução recomendada (ajustada à stack real)

1. **`npm install @supabase/supabase-js`** + criar `.env` + criar clients `supabase.ts` / `supabase.server.ts`
2. **Criar schema no Supabase** (tabelas + RLS + bucket de storage)
3. **Mover landing atual** para `routes/parceiros.tsx` + criar nova `routes/index.tsx` com bifurcação (SC-005/006)
4. **Basic Auth no middleware** do `start.ts` (SC-009)
5. **Admin de imóveis** — layout, listagem, formulário, upload (SC-010–012)
6. **Catálogo público** — `/imoveis` e `/imoveis/$slug` (SC-013/014)
7. **WhatsApp no detalhe** com nome do imóvel pré-preenchido (SC-016)
8. **QA + responsividade** (SC-017/018)
