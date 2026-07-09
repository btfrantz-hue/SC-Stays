import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

const SITE_URL = "https://www.scstays.com.br";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import logoAsset from "@/assets/sc-stays-logo-transparent.png";
import { Menu, X } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SC Stays Collection — Gestão de Aluguéis de Curta Temporada" },
      { name: "description", content: "Cuidamos do seu imóvel de ponta a ponta. Mais ocupação, mais rentabilidade e zero dor de cabeça em Santa Catarina." },
      { name: "author", content: "SC Stays Collection" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: "SC Stays Collection" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: "SC Stays Collection — Gestão de Aluguéis de Curta Temporada em Santa Catarina" },
      { property: "og:description", content: "Gestão de aluguéis de curta temporada em Florianópolis, SC. Mais ocupação, rentabilidade e zero dor de cabeça." },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "SC Stays Collection — Gestão de aluguéis de curta temporada em Santa Catarina" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SC Stays Collection — Gestão de Aluguéis de Curta Temporada em Santa Catarina" },
      { name: "twitter:description", content: "Cuidamos do seu imóvel de ponta a ponta. Mais ocupação, mais rentabilidade e zero dor de cabeça em Santa Catarina." },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const PARCEIROS_NAV = [
  { href: "#problema", label: "O Problema" },
  { href: "#solucao", label: "A Solução" },
  { href: "#servicos", label: "O Que Fazemos" },
  { href: "#processo", label: "Como Funciona" },
  { href: "#faq", label: "FAQ" },
  { href: "#contato", label: "Contato" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // No header on home (has its own logo) or admin routes (own layout)
  if (pathname === "/" || pathname.startsWith("/admin")) return null;

  const showFullNav = pathname === "/parceiros";
  const isGuestSide = pathname.startsWith("/imoveis");

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoAsset} alt="SC Stays Collection" className="h-20 w-auto" />
        </Link>

        {/* Institutional nav — /parceiros only */}
        {showFullNav && (
          <>
            <nav className="hidden md:flex items-center gap-8 text-sm text-navy/80">
              {PARCEIROS_NAV.map((l) => (
                <a key={l.href} href={l.href} className="hover:text-gold transition">{l.label}</a>
              ))}
            </nav>

            <a
              href="#proposta"
              className="hidden md:inline-flex items-center px-5 py-2.5 text-xs tracking-[0.24em] uppercase bg-navy text-cream hover:bg-navy-deep transition"
            >
              Fale Conosco
            </a>

            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden p-2 -mr-2 text-navy"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </>
        )}

        {/* Guest side CTA — /imoveis/* */}
        {isGuestSide && (
          <Link
            to="/parceiros"
            className="text-xs tracking-[0.2em] uppercase text-navy/70 hover:text-gold transition hidden sm:block"
          >
            Sou proprietário →
          </Link>
        )}
      </div>

      {showFullNav && open && (
        <div className="md:hidden bg-cream border-b border-border/50 px-6 pb-6 pt-2">
          <nav className="flex flex-col gap-1">
            {PARCEIROS_NAV.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm text-navy/80 hover:text-gold border-b border-border/30 last:border-0 transition"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#proposta"
            onClick={() => setOpen(false)}
            className="mt-5 flex items-center justify-center px-6 py-3 text-xs tracking-[0.24em] uppercase bg-navy text-cream"
          >
            Fale Conosco
          </a>
        </div>
      )}
    </header>
  );
}

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": SITE_URL,
  name: "SC Stays Collection",
  description:
    "Gestão especializada de aluguéis de curta temporada em Santa Catarina. Cuidamos do seu imóvel de ponta a ponta — anúncios, hóspedes, limpeza, precificação e relatórios transparentes.",
  url: SITE_URL,
  telephone: "+55-48-99182-2477",
  image: OG_IMAGE,
  logo: `${SITE_URL}/favicon.ico`,
  sameAs: ["https://www.instagram.com/scstayscollection"],
  address: {
    "@type": "PostalAddress",
    addressRegion: "SC",
    addressCountry: "BR",
  },
  areaServed: [
    { "@type": "City", name: "Florianópolis", addressCountry: "BR" },
    { "@type": "State", name: "Santa Catarina", addressCountry: "BR" },
  ],
  priceRange: "$$",
  knowsAbout: [
    "Airbnb",
    "Booking.com",
    "aluguel por temporada",
    "gestão de imóveis",
    "short-term rental",
  ],
};

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
