export const SITE_URL = process.env.SITE_URL || 'https://conflictedape.dev';

// Ensures a leading and trailing slash regardless of how BASE_PATH is..
// consumer (Astro's `base` config, and in turn `import.meta.env.BASE_URL`)
// can safely concatenate paths without worrying about missing slashes.
function normalizeBasePath(path: string): string {
	const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
	return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

export const BASE_PATH = normalizeBasePath(process.env.BASE_PATH || '/');

// `import.meta.env.DEV` is true for `astro dev`/local builds and false for
// production builds (`astro build`). Reused wherever behavior should differ
// between local development and production (e.g. surfacing draft posts).
export const IS_DEV = import.meta.env.DEV
