import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";

// Set DEPLOY_TARGET=vercel (or VERCEL=1, which Vercel sets automatically) to
// skip the Cloudflare plugin when building/deploying to Vercel.
const isVercel =
  process.env.VERCEL === "1" || process.env.DEPLOY_TARGET === "vercel";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    ...(isVercel ? [] : [cloudflare({ viteEnvironment: { name: "ssr" } })]),
    tanstackStart({ server: { entry: "server" } }),
    viteReact(),
  ],
  // On Vercel, fully bundle the SSR output so the serverless function has
  // zero external bare-specifier imports. Vercel's NFT trace can't always
  // resolve subpath exports like `@tanstack/router-core/ssr/server`, which
  // causes "referencing unsupported modules" errors. Bundling everything
  // avoids that entirely. (Node built-ins remain external.)
  ...(isVercel
    ? {
        ssr: {
          noExternal: true,
        },
      }
    : {}),
});

