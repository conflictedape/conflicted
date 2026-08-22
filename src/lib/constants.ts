// `process` only exists in Node/SSR contexts (build time, astro.config.ts).
// This module is also imported by client-hydrated React components (e.g.
// Navbar.tsx, for `withBase`), where `process` is undefined — guard access
// so importing this file never crashes client-side hydration.
const env: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {};

export const SITE_URL = env.SITE_URL || 'https://conflictedape.dev';

// Ensures a leading and trailing slash regardless of how BASE_PATH is..
// consumer (Astro's `base` config, and in turn `import.meta.env.BASE_URL`)
// can safely concatenate paths without worrying about missing slashes.
function normalizeBasePath(path: string): string {
	const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
	return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

// Read once from the BASE_PATH env var (see .github/workflows/astro.yml,
// which currently sets this to "/conflicted" for the GitHub Pages deploy).
// Passed straight into Astro's `base` config in astro.config.ts — this is
// the single source of truth for the site's deployment sub-path, and is "/"
// for deployments served from the domain root (e.g. a future Cloudflare
// Pages deploy at conflictedape.dev).
export const BASE_PATH = normalizeBasePath(env.BASE_PATH || '/');

// `import.meta.env.DEV` is true for `astro dev`/local builds and false for
// production builds (`astro build`). Reused wherever behavior should differ
// between local development and production (e.g. surfacing draft posts).
export const IS_DEV = import.meta.env.DEV;
