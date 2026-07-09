import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home, Calendar, Sparkles, TrendingUp, FileText,
  Headphones, DollarSign, BarChart3, Search, ClipboardEdit,
  Settings, Award, Instagram, Globe, Phone, ShieldCheck, Clock, Heart, CheckCircle2, Mail,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import logoAsset from "@/assets/sc-stays-logo-transparent.png";
import heroLiving from "@/assets/hero-living.jpg";
import bedroom from "@/assets/bedroom.jpg";
import coast from "@/assets/coast.jpg";

export const Route = createFileRoute("/parceiros")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "SC Stays Collection — Gestão de Airbnb e Temporada em Santa Catarina" },
      { name: "description", content: "Gestão de aluguéis de curta temporada em Florianópolis, SC. Cuidamos do seu imóvel de ponta a ponta — mais ocupação, mais rentabilidade, zero dor de cabeça." },
    ],
  }),
});

const WA_URL = "https://wa.me/5548991822477";
const WA_PROPOSTA = `${WA_URL}?text=${encodeURIComponent("Olá! Tenho interesse em saber mais sobre a gestão do meu imóvel com a SC Stays.")}`;

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

function WhatsAppButton() {
  return (
    <a
      href={WA_PROPOSTA}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a SC Stays no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-transform hover:scale-110"
      style={{ backgroundColor: "#25D366" }}
    >
      <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

const FAQ_ITEMS = [
  {
    q: "Quanto custa o serviço da SC Stays?",
    a: "Trabalhamos com comissão sobre as receitas geradas — sem mensalidade, sem custo fixo. Você só paga quando o imóvel está rendendo. Entre em contato para receber uma proposta personalizada.",
  },
  {
    q: "Posso usar o meu imóvel quando quiser?",
    a: "Sim, sempre. O imóvel continua sendo seu. Basta nos avisar as datas que você quer reservar para uso próprio — bloqueamos o calendário sem burocracia, sem custo e sem perguntas.",
  },
  {
    q: "O que acontece se um hóspede causar algum dano?",
    a: "Todas as reservas incluem depósito de segurança ou a proteção da própria plataforma. Em caso de dano, registramos o chamado imediatamente e acompanhamos o processo de ressarcimento com você do início ao fim.",
  },
  {
    q: "Em quais cidades vocês atuam?",
    a: "Atualmente atuamos em Florianópolis, SC. Estamos em expansão — entre em contato e verificamos disponibilidade para a sua região.",
  },
  {
    q: "Como acompanho os resultados do meu imóvel?",
    a: "Você recebe relatórios mensais com receita, taxa de ocupação, avaliações e movimentações do período — tudo organizado e legível, sem precisar entrar em nenhuma plataforma para entender o que está acontecendo.",
  },
  {
    q: "Qual o prazo mínimo de contrato?",
    a: "Conversamos caso a caso para encontrar as condições ideais para o seu perfil. Fale com a gente e montamos uma proposta adaptada à sua situação.",
  },
];

function LeadForm() {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", bairro: "", situacao: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || !form.email || !form.bairro || !form.situacao) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    setError("");
    const msg = encodeURIComponent(
      `Olá! Tenho interesse na gestão do meu imóvel.\n\nNome: ${form.nome}\nE-mail: ${form.email}${form.telefone ? `\nTelefone: ${form.telefone}` : ""}\nBairro: ${form.bairro}\nSituação: ${form.situacao}`
    );
    window.open(`${WA_URL}?text=${msg}`, "_blank");
    setSent(true);
  }

  const inputClass =
    "w-full bg-cream border border-border/60 px-4 py-3 text-sm text-navy placeholder:text-muted-ink/40 focus:outline-none focus:border-gold transition";
  const labelClass = "block text-xs tracking-[0.15em] uppercase text-muted-ink mb-1.5";

  if (sent) {
    return (
      <div className="py-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-gold mx-auto" />
        <p className="mt-4 font-display text-xl text-navy">Ótimo! Redirecionamos para o WhatsApp.</p>
        <p className="mt-2 text-sm text-muted-ink">
          Janela não abriu?{" "}
          <a href={WA_PROPOSTA} target="_blank" rel="noopener noreferrer" className="text-gold underline">
            Clique aqui.
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nome <span className="text-gold">*</span></label>
          <input type="text" required value={form.nome} onChange={set("nome")} placeholder="Seu nome" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>E-mail <span className="text-gold">*</span></label>
          <input type="email" required value={form.email} onChange={set("email")} placeholder="seu@email.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>
            Telefone / WhatsApp{" "}
            <span className="text-muted-ink/50 normal-case tracking-normal">(opcional)</span>
          </label>
          <input type="tel" value={form.telefone} onChange={set("telefone")} placeholder="(48) 99999-9999" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Bairro do imóvel <span className="text-gold">*</span></label>
          <input type="text" required value={form.bairro} onChange={set("bairro")} placeholder="Ex.: Ingleses, Jurerê, Centro..." className={inputClass} />
        </div>
      </div>
      <div className="mt-4">
        <label className={labelClass}>Situação atual do imóvel <span className="text-gold">*</span></label>
        <select required value={form.situacao} onChange={set("situacao")} className={`${inputClass} appearance-none`}>
          <option value="" disabled>Selecione...</option>
          <option value="Ainda não está anunciado">Ainda não está anunciado em nenhuma plataforma</option>
          <option value="Anuncio eu mesmo">Já anuncio, mas cuido tudo sozinho</option>
          <option value="Tenho gestora, quero melhorar">Tenho gestora atual e quero melhorar os resultados</option>
        </select>
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs tracking-[0.24em] uppercase bg-navy text-cream hover:bg-navy-deep transition"
        >
          Quero uma proposta
        </button>
      </div>
    </form>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* HERO */}
      <section id="top" className="relative pt-16 pb-16 lg:pt-20 lg:pb-20 min-h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-10 items-center w-full">
          <div className="lg:col-span-6">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-navy">
              Seu imóvel <span className="whitespace-nowrap"><em className="text-gold not-italic font-normal">bem cuidado</em>,</span>{" "}
              sua renda <span className="whitespace-nowrap"><em className="text-gold not-italic font-normal">bem administrada</em>.</span>
            </h1>
            <p className="mt-6 text-base lg:text-lg text-muted-ink max-w-xl leading-relaxed">
              A SC Stays Collection cuida de tudo para você ter mais tempo, tranquilidade
              e rentabilidade com o seu imóvel de curta temporada.
            </p>
            <p className="mt-2 text-sm text-muted-ink/70 tracking-wide">
              Florianópolis · Santa Catarina
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#proposta"
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
                fetchPriority="high"
                className="w-full h-[300px] md:h-[360px] lg:h-[420px] object-cover"
              />
              <div className="slide-frame-band" />
            </div>
          </div>
        </div>
      </section>

      {/* PLATAFORMAS */}
      <section className="py-5 border-y border-border/50 bg-cream-deep/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-ink shrink-0">
              Gerenciamos em
            </span>
            {["Airbnb", "Booking.com", "Temporada Livre"].map((platform) => (
              <span
                key={platform}
                className="text-sm font-medium text-navy/70 bg-cream border border-navy/20 px-4 py-1.5 rounded-sm tracking-wide"
              >
                {platform}
              </span>
            ))}
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

      {/* CTA INTERMEDIÁRIO */}
      <div className="bg-navy py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-display text-xl lg:text-2xl text-cream text-center md:text-left">
            Seu imóvel pode estar rendendo mais.{" "}
            <em className="text-gold not-italic">Vamos conversar?</em>
          </p>
          <a
            href={WA_PROPOSTA}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 text-xs tracking-[0.24em] uppercase bg-gold text-navy hover:bg-gold-soft transition font-medium"
          >
            <Phone className="w-4 h-4" />
            Falar no WhatsApp
          </a>
        </div>
      </div>

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

      {/* CAPTAÇÃO — FORMULÁRIO */}
      <section id="proposta" className="py-16 lg:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="slide-frame p-8 lg:p-12 grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionLabel>Receba uma proposta</SectionLabel>
              <h2 className="font-display text-3xl lg:text-4xl text-navy leading-tight">
                Descubra quanto o seu imóvel pode render.
              </h2>
              <p className="mt-4 text-muted-ink leading-relaxed max-w-md">
                Preencha o formulário e entraremos em contato para apresentar
                uma proposta personalizada — sem compromisso.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Resposta em até 24 horas",
                  "Proposta sob medida para o seu imóvel",
                  "Sem compromisso, sem custo",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-muted-ink">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <LeadForm />
            <div className="slide-frame-band" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 lg:py-20 bg-cream-deep/40 min-h-[60vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="slide-frame p-8 lg:p-12 max-w-3xl mx-auto">
            <SectionLabel>Perguntas Frequentes</SectionLabel>
            <h2 className="font-display text-3xl lg:text-4xl text-navy leading-tight">
              Tudo que você precisa saber antes de começar.
            </h2>
            <Accordion type="single" collapsible className="mt-10">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border/60">
                  <AccordionTrigger className="font-display text-lg text-navy text-left hover:text-gold transition py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-ink text-sm leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="slide-frame-band" />
          </div>
        </div>
      </section>

      {/* FOOTER / CONTATO */}
      <footer id="contato" className="bg-navy text-cream min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-cream p-4 rounded-sm">
                <img src={logoAsset} alt="SC Stays Collection" className="h-20 w-auto" />
              </div>
              <p className="mt-6 font-display text-2xl lg:text-3xl leading-tight">
                Pronto para transformar seu imóvel em um ativo bem cuidado?
              </p>
              <p className="mt-3 text-cream/70 max-w-md text-sm">
                Fale com a SC Stays Collection e receba uma proposta personalizada.
              </p>
            </div>
            <div className="space-y-5">
              <a href={WA_PROPOSTA} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-gold/50 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs tracking-[0.24em] uppercase text-gold">WhatsApp</div>
                  <div className="text-lg">(48) 99182-2477</div>
                </div>
              </a>
              <a href="mailto:contato@scstays.com.br" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-gold/50 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs tracking-[0.24em] uppercase text-gold">E-mail</div>
                  <div className="text-lg">contato@scstays.com.br</div>
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

      <WhatsAppButton />
    </div>
  );
}
