export const SITE_URL = process.env.SITE_URL || 'https://conflictedape.dev';

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
export const BASE_PATH = normalizeBasePath(process.env.BASE_PATH || '/');

const ABSOLUTE_URL_RE = /^([a-z][a-z\d+.-]*:)?\/\//i;

/**
 * Prefixes an app-relative path (a `public/` asset, an internal route, etc.)
 * with the site's base path, so images and links keep working whether the
 * site is deployed at the domain root (no base path) or under a sub-path
 * like "/conflicted" (GitHub Pages). Use this instead of hardcoding a
 * leading "/" on any path that points somewhere within this site — e.g.
 * `withBase('conflicted_ape.webp')` or `withBase(`blog/${slug}/`)`.
 *
 * Reads `import.meta.env.BASE_URL` — Astro's runtime mirror of `BASE_PATH`,
 * derived from the `base` option in astro.config.ts — rather than
 * `BASE_PATH` directly, so this is safe to call from anywhere Vite
 * processes: Astro frontmatter, plain data modules, and client-hydrated
 * React components alike. `process.env` isn't available in the browser, but
 * `import.meta.env.BASE_URL` is statically inlined into every bundle.
 *
 * Absolute URLs (`https://...`, `//...`, `mailto:...`, etc.) are returned
 * unchanged, since they don't need — and shouldn't get — a base prefix.
 */
export function withBase(path: string): string {
	if (ABSOLUTE_URL_RE.test(path) || path.startsWith('mailto:')) {
		return path;
	}
	return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

// `import.meta.env.DEV` is true for `astro dev`/local builds and false for
// production builds (`astro build`). Reused wherever behavior should differ
// between local development and production (e.g. surfacing draft posts).
export const IS_DEV = import.meta.env.DEV;
