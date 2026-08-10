// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    // Overrides the package's cloudflare default. Vercel is the deploy target
    // (SC-025) — this preset makes the build write .vercel/output (Build Output
    // API v3) instead of .output/server/wrangler.json, which is what
    // `vercel deploy --prebuilt` in .github/workflows/deploy.yml expects.
    //
    // Nothing here needs Cloudflare's `nodejs_compat_populate_process_env` flag
    // anymore: on Vercel the server runtime populates process.env natively, so
    // ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_SESSION_SECRET / SUPABASE_SERVICE_ROLE_KEY
    // resolve without any extra compatibility flag.
    preset: "vercel",
  },
});
