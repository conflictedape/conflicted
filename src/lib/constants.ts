export const SITE_URL = process.env.SITE_URL || 'https://conflictedape.dev';
export const BASE_PATH = process.env.BASE_PATH || '/';

// `import.meta.env.DEV` is true for `astro dev`/local builds and false for
// production builds (`astro build`). Reused wherever behavior should differ
// between local development and production (e.g. surfacing draft posts).
export const IS_DEV = import.meta.env.DEV
