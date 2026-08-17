import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import { transformerMetaHighlight, transformerNotationHighlight } from '@shikijs/transformers';
import 'dotenv/config';
import { remarkReadingTime } from './src/lib/remark-reading-time';
import { SITE_URL, BASE_PATH } from './src/lib/constants';

export default defineConfig({
	site: SITE_URL,
	base: BASE_PATH,
	compressHTML: true,
	integrations: [mdx(), react(), sitemap()],
	markdown: {
		processor: unified({
			smartypants: false,
			remarkPlugins: [remarkReadingTime],
			rehypePlugins: [
				rehypeSlug,
				[rehypeAutolinkHeadings, { behavior: 'wrap' }],
				[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
			],
		}),
		shikiConfig: {
			themes: {
				light: 'solarized-light',
				dark: 'dark-plus',
			},
			wrap: true,
			// @ts-expect-error
			langs: ['ts', 'js', 'rust', 'python'],
			transformers: [
				transformerMetaHighlight(),
				transformerNotationHighlight(),
				{
					name: 'add-filename-attr',
					pre(node) {
						const raw = this.options.meta?.__raw;
						if (!raw) return;
						const match = raw.match(/filename="([^"]+)"/);
						if (match?.[1]) {
							node.properties['data-filename'] = match[1];
						}
					},
				},
			],
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
