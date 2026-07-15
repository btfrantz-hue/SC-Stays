import { createFileRoute, Link, Outlet, useMatchRoute, useNavigate, useLocation } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { adminLogout } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/admin")({
  component: AdminRoot,
  head: () => ({
    meta: [{ title: "Admin — SC Stays Collection" }, { name: "robots", content: "noindex, nofollow" }],
  }),
});

function AdminRoot() {
  const matchRoute = useMatchRoute();
  const isExact = matchRoute({ to: "/admin" });
  const { pathname } = useLocation();
  const isLoginPage = pathname === "/admin/login";
  const navigate = useNavigate();

  async function handleLogout() {
    await adminLogout();
    navigate({ to: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-navy text-cream">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/admin" className="text-sm tracking-[0.2em] uppercase">
            SC Stays — Admin
          </Link>
          {!isLoginPage && (
            <nav className="flex items-center gap-6 text-sm">
              <Link to="/admin/imoveis" className="hover:text-gold transition">
                Imóveis
              </Link>
              <Link to="/admin/pagina-imoveis" className="hover:text-gold transition">
                Página Imóveis
              </Link>
              <Link to="/admin/pagina-parceiros" className="hover:text-gold transition">
                Página Parceiros
              </Link>
              <Link to="/admin/leads" className="hover:text-gold transition">
                Leads
              </Link>
              <button onClick={handleLogout} className="text-cream/70 hover:text-gold transition">
                Sair
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">{isExact ? <AdminDashboard /> : <Outlet />}</main>
      <Toaster />
    </div>
  );
}

function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Painel administrativo</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Gerencie os imóveis exibidos no catálogo público.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/admin/imoveis"
          className="inline-flex items-center px-5 py-2.5 text-xs tracking-[0.24em] uppercase bg-navy text-cream hover:bg-navy-deep transition"
        >
          Ver imóveis
        </Link>
        <Link
          to="/admin/pagina-imoveis"
          className="inline-flex items-center px-5 py-2.5 text-xs tracking-[0.24em] uppercase border border-navy text-navy hover:bg-navy hover:text-cream transition"
        >
          Página /imoveis
        </Link>
        <Link
          to="/admin/pagina-parceiros"
          className="inline-flex items-center px-5 py-2.5 text-xs tracking-[0.24em] uppercase border border-navy text-navy hover:bg-navy hover:text-cream transition"
        >
          Página /parceiros
        </Link>
        <Link
          to="/admin/leads"
          className="inline-flex items-center px-5 py-2.5 text-xs tracking-[0.24em] uppercase border border-navy text-navy hover:bg-navy hover:text-cream transition"
        >
          Ver leads
        </Link>
      </div>
    </div>
  );
}
