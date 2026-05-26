import { createStart } from "@tanstack/react-start";

// Branded SSR error handling lives in `src/server.ts` (the request entry)
// — it catches both thrown errors and h3's swallowed-500 responses and
// renders the styled error page. We intentionally don't wire an error
// middleware here, because Vite's worker dev runner has been observed
// to occasionally return `undefined` for re-exports from
// `@tanstack/react-start` after HMR re-optimization, which would break
// `createMiddleware()` calls and bring SSR down.

export const startInstance = createStart(() => ({}));
