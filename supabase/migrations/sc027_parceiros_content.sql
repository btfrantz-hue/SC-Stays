-- SC-027 — conteúdo editável da página /parceiros
--
-- Até aqui /parceiros só tinha a *visibilidade* dos blocos no admin (SC-023);
-- todo o texto era hardcoded em src/routes/parceiros.tsx. Estas duas tabelas
-- espelham resultado_cards / depoimentos (SC-021, página /imoveis), com o
-- prefixo parceiros_ para não colidir.
--
-- COMO APLICAR: colar no SQL Editor do projeto zeiauwvkfgibysayvhxu.
-- É idempotente — rodar de novo não duplica nada.
--
-- Nota: este é o primeiro arquivo de supabase/migrations/. As migrations
-- anteriores (sc007, sc010, sc021, sc023) foram aplicadas direto no banco
-- remoto e não estão versionadas aqui.

-- ── Resultados ───────────────────────────────────────────────────────────────
-- 4 linhas fixas: o admin edita, não adiciona nem remove.
-- `valor` é opcional de propósito. Vazio, a página renderiza só ícone +
-- legenda (como era hardcoded). Preenchido, o número aparece acima da legenda.
-- Isso deixa a seção subir antes das métricas reais existirem.
create table if not exists parceiros_resultados (
  id         uuid primary key default gen_random_uuid(),
  icon_key   text not null,
  valor      text not null default '',
  label      text not null,
  sort_order int  not null default 0
);

-- ── Depoimentos de proprietários ─────────────────────────────────────────────
-- Lista dinâmica. Separada de `depoimentos` (que é de hóspedes, em /imoveis):
-- são públicos e propósitos diferentes, misturar exigiria filtro em toda query.
create table if not exists parceiros_depoimentos (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  cidade     text not null,
  texto      text not null,
  sort_order int  not null default 0
);

-- ── RLS ──────────────────────────────────────────────────────────────────────
-- Mesmo desenho do SC-021: leitura pública (o catálogo lê com a chave anon),
-- escrita sem policy nenhuma — só o service_role, que ignora RLS, escreve,
-- e ele só é usado dentro de server functions com requireAdminMiddleware.
alter table parceiros_resultados   enable row level security;
alter table parceiros_depoimentos  enable row level security;

drop policy if exists "public read parceiros_resultados"  on parceiros_resultados;
drop policy if exists "public read parceiros_depoimentos" on parceiros_depoimentos;

create policy "public read parceiros_resultados"
  on parceiros_resultados for select using (true);
create policy "public read parceiros_depoimentos"
  on parceiros_depoimentos for select using (true);

-- ── Seed ─────────────────────────────────────────────────────────────────────
-- Reproduz exatamente o bloco que estava hardcoded, para a página não mudar
-- de aparência no deploy. As métricas entram depois, pelo admin.
insert into parceiros_resultados (icon_key, valor, label, sort_order)
select * from (values
  ('trending_up', '', 'Mais ocupação',        0),
  ('dollar',      '', 'Mais rentabilidade',   1),
  ('heart',       '', 'Melhores avaliações',  2),
  ('clock',       '', 'Mais tempo para você', 3)
) as seed(icon_key, valor, label, sort_order)
where not exists (select 1 from parceiros_resultados);

-- Visibilidade da seção nova. Começa desligada: sem depoimento cadastrado a
-- seção ficaria vazia no site.
insert into site_sections (key, visible) values ('parceiros_depoimentos', false)
  on conflict (key) do nothing;
