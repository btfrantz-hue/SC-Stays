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
    cloudflare: {
      // Without this flag, Cloudflare's nodejs_compat only populates process.env
      // with NODE_ENV — Worker vars/secrets (ADMIN_USERNAME, SUPABASE_SERVICE_ROLE_KEY,
      // etc.) never reach process.env, so every process.env.X lookup on the server
      // silently returns undefined even when the var is set in the dashboard.
      //
      // The `cloudflare` type here only declares nodeCompat/deployConfig, but
      // vite-tanstack-config forwards this object to nitro's cloudflare preset
      // unfiltered — `wrangler` is a real, working nitro option (confirmed in
      // the built .output/server/wrangler.json). Remove the ts-expect-error if
      // the package's type ever grows a `wrangler` field.
      // @ts-expect-error — see comment above
      wrangler: { compatibility_flags: ["nodejs_compat_populate_process_env"] },
    },
  },
});
