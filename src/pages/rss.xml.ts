import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
	if (!context.site) {
		throw new Error('Site URL is not configured. Set `site` in astro.config.ts.');
	}

	const blog = await getCollection('blog');
	return rss({
		title: 'Conflicted Ape — Blog',
		description: 'Thoughts on software engineering, web development, and building things.',
		site: context.site.origin,
		// never knew rss has styles.. lmao
		stylesheet: '/pretty-feed-v3.xsl',
		items: blog
			.flatMap((post) => {
				if (post.data.draft) return [];
				return [
					{
						title: post.data.title,
						pubDate: post.data.publishDate,
						description: post.data.description,
						link: `/blog/${post.id.replace(/\/index$/, '')}/`,
					},
				];
			})
			.sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1)),
	});
}
