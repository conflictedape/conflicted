import { useEffect, useRef } from 'react';
import { loadEmbedScript, reprocessEmbedScript } from '@/components/mdx/embeds/loadEmbedScript';
import {
	justifyClassName,
	resolveWidth,
	type Align,
	type MediaWidth,
} from '@/components/mdx/embeds/layout';

const WIDGETS_SRC = 'https://embed.reddit.com/widgets.js';

interface RedditProps {
	/** Subreddit without r/, e.g. "programming" */
	subreddit: string;
	/** Numeric post ID from the URL */
	postId: string;
	title: string;
	author: string;
	caption?: string;
	width?: MediaWidth;
	align?: Align;
	theme?: 'light' | 'dark';
	/** Embed card height in px. Reddit renders a fixed-height iframe. */
	height?: number;
}

export function Reddit({
	subreddit,
	postId,
	title,
	author,
	caption,
	width = 'md',
	align = 'center',
	theme = 'dark',
	height = 500,
}: RedditProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let cancelled = false;
		loadEmbedScript(WIDGETS_SRC).then(() => {
			// Reddit's script has no manual re-scan API, so re-inserting it is the
			// documented workaround to process blockquotes added after initial load.
			if (!cancelled) reprocessEmbedScript(WIDGETS_SRC);
		});
		return () => {
			cancelled = true;
		};
	}, [subreddit, postId, theme]);

	const postUrl = `https://www.reddit.com/r/${subreddit}/comments/${postId}/`;
	const userUrl = `https://www.reddit.com/user/${author}/`;
	const subredditUrl = `https://www.reddit.com/r/${subreddit}/`;
	const { className, style } = resolveWidth(width);

	return (
		<figure className="my-8">
			<div ref={containerRef} className={`flex w-full ${justifyClassName[align]}`}>
				<div className={className} style={style}>
					<blockquote
						className="reddit-embed-bq"
						data-embed-theme={theme}
						data-embed-height={height}
						style={{ height }}
					>
						<a href={postUrl}>{title}</a>
						<br />
						by <a href={userUrl}>u/{author}</a> in <a href={subredditUrl}>{subreddit}</a>
					</blockquote>
				</div>
			</div>
			{caption ? (
				<figcaption className="text-muted-foreground mt-3 text-center text-sm">
					{caption}
				</figcaption>
			) : null}
		</figure>
	);
}
