import { createFileRoute } from "@tanstack/react-router";
import {
  Home, Calendar, Sparkles, TrendingUp, FileText,
  Headphones, DollarSign, BarChart3, Search, ClipboardEdit,
  Settings, Award, Instagram, Globe, Phone, ShieldCheck, Clock, Heart, CheckCircle2,
} from "lucide-react";
import logoAsset from "@/assets/sc-stays-logo.png.asset.json";
import heroLiving from "@/assets/hero-living.jpg";
import bedroom from "@/assets/bedroom.jpg";
import coast from "@/assets/coast.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "SC Stays Collection — Gestão de Aluguéis de Curta Temporada" },
      { name: "description", content: "Cuidamos do seu imóvel de ponta a ponta. Mais ocupação, mais rentabilidade e zero dor de cabeça em Santa Catarina." },
      { property: "og:image", content: heroLiving },
      { name: "twitter:image", content: heroLiving },
    ],
  }),
});

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="gold-rule" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}

function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <div className="shrink-0 w-12 h-12 rounded-full border border-gold/60 flex items-center justify-center text-gold bg-cream">
      {children}
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* NAV */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <img src={logoAsset.url} alt="SC Stays Collection" className="h-10 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-navy/80">
            <a href="#problema" className="hover:text-gold transition">O Problema</a>
            <a href="#solucao" className="hover:text-gold transition">A Solução</a>
            <a href="#servicos" className="hover:text-gold transition">O Que Fazemos</a>
            <a href="#processo" className="hover:text-gold transition">Como Funciona</a>
            <a href="#contato" className="hover:text-gold transition">Contato</a>
          </nav>
          <a
            href="#contato"
            className="hidden md:inline-flex items-center px-5 py-2.5 text-xs tracking-[0.24em] uppercase bg-navy text-cream hover:bg-navy-deep transition"
          >
            Fale Conosco
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative pt-32 pb-16 lg:pt-36 lg:pb-20 min-h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-10 items-center w-full">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="gold-rule" />
              <span className="eyebrow">Santa Catarina · Curta Temporada</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-navy">
              Seu imóvel <em className="text-gold not-italic font-normal">bem cuidado</em>,
              sua renda <em className="text-gold not-italic font-normal">bem administrada</em>.
            </h1>
            <p className="mt-6 text-base lg:text-lg text-muted-ink max-w-xl leading-relaxed">
              A SC Stays Collection cuida de tudo para você ter mais tempo, tranquilidade
              e rentabilidade com o seu imóvel de curta temporada.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contato"
                className="inline-flex items-center px-6 py-3 text-xs tracking-[0.24em] uppercase bg-navy text-cream hover:bg-navy-deep transition"
              >
                Quero uma proposta
              </a>
              <a
                href="#servicos"
                className="inline-flex items-center px-6 py-3 text-xs tracking-[0.24em] uppercase border border-navy/30 text-navy hover:border-gold hover:text-gold transition"
              >
                Conhecer serviços
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="slide-frame p-2.5">
              <img
                src={heroLiving}
                alt="Sala de estar de imóvel de alto padrão com vista para o mar"
                width={1600}
                height={1200}
                className="w-full h-[300px] md:h-[360px] lg:h-[420px] object-cover"
              />
              <div className="slide-frame-band" />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section id="problema" className="py-16 lg:py-20 bg-cream-deep/40 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="slide-frame p-8 lg:p-12 grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <SectionLabel>O Problema</SectionLabel>
              <h2 className="font-display text-3xl lg:text-4xl text-navy leading-tight">
                Gerenciar imóveis para aluguel de curta temporada exige tempo e atenção que você não tem.
              </h2>
              <p className="mt-4 text-muted-ink leading-relaxed">
                São múltiplas plataformas, hóspedes, cobranças, limpezas e imprevistos —
                todos concorrendo pela sua agenda e pela sua paz.
              </p>
            </div>
            <ul className="lg:col-span-7 lg:border-l lg:border-border lg:pl-10 space-y-4">
              {[
                { icon: <Clock className="w-5 h-5" />, t: "Tempo e atenção constantes" },
                { icon: <Calendar className="w-5 h-5" />, t: "Múltiplas plataformas e reservas" },
                { icon: <Sparkles className="w-5 h-5" />, t: "Limpeza, manutenção e suporte aos hóspedes" },
                { icon: <TrendingUp className="w-5 h-5" />, t: "Precificação dinâmica e baixa ocupação" },
                { icon: <FileText className="w-5 h-5" />, t: "Falta de organização e relatórios claros" },
              ].map((i) => (
                <li key={i.t} className="flex items-center gap-4">
                  <IconCircle>{i.icon}</IconCircle>
                  <span className="text-base lg:text-lg text-navy">{i.t}</span>
                </li>
              ))}
            </ul>
            <div className="slide-frame-band" />
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section id="solucao" className="py-16 lg:py-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="slide-frame grid lg:grid-cols-2 overflow-hidden">
            <div className="p-8 lg:p-12">
              <SectionLabel>A Solução</SectionLabel>
              <h2 className="font-display text-3xl lg:text-4xl text-navy leading-tight">
                A SC Stays cuida de tudo para você ter mais tempo, tranquilidade e rentabilidade.
              </h2>
              <p className="mt-4 text-muted-ink leading-relaxed max-w-lg">
                Uma operação boutique, sob medida para proprietários que querem transformar
                seu imóvel em um ativo bem cuidado — sem abrir mão do padrão.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-6">
                {[
                  { icon: <Home className="w-5 h-5" />, t: "Gestão completa" },
                  { icon: <ShieldCheck className="w-5 h-5" />, t: "Hóspedes satisfeitos" },
                  { icon: <TrendingUp className="w-5 h-5" />, t: "Mais ocupação e rentabilidade" },
                  { icon: <Clock className="w-5 h-5" />, t: "Mais tempo e tranquilidade" },
                ].map((i) => (
                  <div key={i.t} className="flex flex-col items-start gap-2">
                    <IconCircle>{i.icon}</IconCircle>
                    <span className="text-sm text-navy font-medium">{i.t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[300px] lg:min-h-0">
              <img
                src={coast}
                alt="Litoral de Santa Catarina ao entardecer"
                loading="lazy"
                width={1600}
                height={1000}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="slide-frame-band" />
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="py-16 lg:py-20 bg-cream-deep/40 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="slide-frame p-8 lg:p-12">
            <SectionLabel>O Que Fazemos</SectionLabel>
            <h2 className="font-display text-3xl lg:text-4xl text-navy leading-tight max-w-2xl">
              Um serviço completo, dos anúncios à experiência do hóspede.
            </h2>

            <div className="mt-10 grid md:grid-cols-2 gap-x-10 gap-y-6">
              {[
                { icon: <Home className="w-5 h-5" />, t: "Gestão de Anúncios", d: "Criamos e otimizamos anúncios nas principais plataformas." },
                { icon: <Headphones className="w-5 h-5" />, t: "Atendimento ao Hóspede", d: "Atendimento rápido e humanizado do check-in ao check-out." },
                { icon: <Calendar className="w-5 h-5" />, t: "Gestão de Reservas", d: "Cuidamos do calendário, preços e comunicação com hóspedes." },
                { icon: <DollarSign className="w-5 h-5" />, t: "Precificação Inteligente", d: "Usamos dados e tecnologia para maximizar sua rentabilidade." },
                { icon: <Sparkles className="w-5 h-5" />, t: "Limpeza e Manutenção", d: "Organizamos limpezas, vistorias e manutenções preventivas." },
                { icon: <BarChart3 className="w-5 h-5" />, t: "Relatórios e Transparência", d: "Você acompanha tudo com clareza e em tempo real." },
              ].map((s) => (
                <div key={s.t} className="flex gap-4">
                  <IconCircle>{s.icon}</IconCircle>
                  <div>
                    <h3 className="font-display text-xl text-navy">{s.t}</h3>
                    <p className="mt-1 text-sm text-muted-ink leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="slide-frame-band" />
          </div>
        </div>
      </section>

      {/* VALOR PARA O DONO */}
      <section className="py-16 lg:py-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="slide-frame grid lg:grid-cols-2 overflow-hidden">
            <div className="p-8 lg:p-12 order-2 lg:order-1">
              <SectionLabel>Valor para quem é dono</SectionLabel>
              <h2 className="font-display text-3xl lg:text-4xl text-navy leading-tight">
                O que muda quando a SC Stays cuida do seu imóvel.
              </h2>
              <ul className="mt-8 space-y-4">
                {[
                  "Mais rentabilidade",
                  "Imóvel sempre bem cuidado",
                  "Hóspedes satisfeitos e avaliações positivas",
                  "Zero dor de cabeça",
                  "Liberdade para focar no que importa",
                ].map((i) => (
                  <li key={i} className="flex items-center gap-4 text-base lg:text-lg text-navy">
                    <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative min-h-[300px] lg:min-h-0 order-1 lg:order-2">
              <img
                src={bedroom}
                alt="Quarto de imóvel de alto padrão preparado para hóspedes"
                loading="lazy"
                width={1400}
                height={1100}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="slide-frame-band" />
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="processo" className="py-16 lg:py-20 bg-cream-deep/40 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="slide-frame p-8 lg:p-12">
            <SectionLabel>Como Funciona</SectionLabel>
            <h2 className="font-display text-3xl lg:text-4xl text-navy leading-tight max-w-2xl">
              Um processo simples, transparente e sob medida.
            </h2>

            <div className="mt-10 relative">
              <div className="hidden md:block absolute top-6 left-[12%] right-[12%] h-px border-t border-dashed border-gold/50" />
              <div className="grid md:grid-cols-4 gap-8 relative">
                {[
                  { icon: <Search className="w-5 h-5" />, n: "1", t: "Análise", d: "Avaliamos seu imóvel e seu objetivo." },
                  { icon: <ClipboardEdit className="w-5 h-5" />, n: "2", t: "Plano personalizado", d: "Criamos a melhor estratégia para o seu imóvel." },
                  { icon: <Settings className="w-5 h-5" />, n: "3", t: "Gestão completa", d: "Cuidamos de tudo no dia a dia com excelência." },
                  { icon: <Award className="w-5 h-5" />, n: "4", t: "Resultados", d: "Você recebe relatórios e acompanha os resultados." },
                ].map((s) => (
                  <div key={s.n} className="text-center flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border border-gold/60 bg-cream flex items-center justify-center text-gold relative z-10">
                      {s.icon}
                    </div>
                    <div className="mt-4 text-xs tracking-[0.24em] uppercase text-gold">{s.n}. {s.t}</div>
                    <p className="mt-2 text-muted-ink text-sm leading-relaxed">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="slide-frame-band" />
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="py-16 lg:py-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="slide-frame p-8 lg:p-12 text-center">
            <SectionLabel>Resultados</SectionLabel>
            <h2 className="font-display text-3xl lg:text-4xl text-navy leading-tight max-w-3xl mx-auto">
              Resultados que você pode esperar.
            </h2>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { icon: <TrendingUp className="w-6 h-6" />, t: "Mais ocupação" },
                { icon: <DollarSign className="w-6 h-6" />, t: "Mais rentabilidade" },
                { icon: <Heart className="w-6 h-6" />, t: "Melhores avaliações" },
                { icon: <Clock className="w-6 h-6" />, t: "Mais tempo para você" },
              ].map((r) => (
                <div key={r.t} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full border border-gold/60 flex items-center justify-center text-gold">
                    {r.icon}
                  </div>
                  <div className="mt-4 text-xs tracking-[0.24em] uppercase text-navy">{r.t}</div>
                </div>
              ))}
            </div>

            <p className="mt-10 font-display text-xl lg:text-2xl text-navy italic max-w-2xl mx-auto leading-snug">
              &ldquo;Transformamos seu imóvel em uma experiência inesquecível
              e um excelente investimento.&rdquo;
            </p>
            <div className="slide-frame-band" />
          </div>
        </div>
      </section>

      {/* FOOTER / CONTATO */}
      <footer id="contato" className="bg-navy text-cream min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img src={logoAsset.url} alt="SC Stays Collection" className="h-16 w-auto brightness-0 invert opacity-90" />
              <p className="mt-6 font-display text-2xl lg:text-3xl leading-tight">
                Pronto para transformar seu imóvel em um ativo bem cuidado?
              </p>
              <p className="mt-3 text-cream/70 max-w-md text-sm">
                Fale com a SC Stays Collection e receba uma proposta personalizada.
              </p>
            </div>
            <div className="space-y-5">
              <a href="https://wa.me/5548991822477" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-gold/50 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs tracking-[0.24em] uppercase text-gold">WhatsApp</div>
                  <div className="text-lg">(48) 99182-2477</div>
                </div>
              </a>
              <a href="https://instagram.com/scstayscollection" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-gold/50 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs tracking-[0.24em] uppercase text-gold">Instagram</div>
                  <div className="text-lg">@scstayscollection</div>
                </div>
              </a>
              <a href="https://www.scstays.com.br" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-gold/50 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs tracking-[0.24em] uppercase text-gold">Site</div>
                  <div className="text-lg">www.scstays.com.br</div>
                </div>
              </a>
            </div>
          </div>
          <div className="mt-16 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between gap-4 text-xs tracking-[0.2em] uppercase text-cream/50">
            <div>© {new Date().getFullYear()} SC Stays Collection</div>
            <div>Gestão de Aluguéis de Curta Temporada</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
