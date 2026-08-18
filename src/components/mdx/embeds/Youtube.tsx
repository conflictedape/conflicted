import { Play } from 'lucide-react';

type MediaWidth = 'sm' | 'md' | 'lg' | 'full' | number;

interface YoutubeProps {
	/** YouTube video ID (e.g. "dQw4w9WgXcQ") */
	id: string;
	title: string;
	caption?: string;
	/**
	 * - 'embed'  → full responsive iframe (default)
	 * - 'inline' → Notion-style link card: thumbnail + title, opens YouTube
	 */
	variant?: 'embed' | 'inline';
	/**
	 * Only applies to embed variant.
	 * - 'sm'   → ~384px
	 * - 'md'   → ~672px (default)
	 * - 'lg'   → ~896px
	 * - 'full' → 100% of the prose column
	 * - number → exact pixel value
	 */
	width?: MediaWidth;
	/** Start time in seconds (embed variant only) */
	start?: number;
}

function resolveWidth(width: MediaWidth): { className: string; style?: React.CSSProperties } {
	if (typeof width === 'number') return { className: 'mx-auto', style: { maxWidth: width } };
	const map = { sm: 'max-w-sm', md: 'max-w-2xl', lg: 'max-w-4xl', full: 'w-full' } as const;
	return { className: `mx-auto ${map[width]}` };
}

function InlineCard({ id, title }: { id: string; title: string }) {
	const thumbnail = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
	const href = `https://www.youtube.com/watch?v=${id}`;

	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="border-border bg-card hover:bg-accent my-4 flex items-center gap-3 overflow-hidden rounded-xl border p-3 no-underline transition-colors"
		>
			<div
				className="relative shrink-0 overflow-hidden rounded-lg"
				style={{ width: 120, aspectRatio: '16/9' }}
			>
				<img src={thumbnail} alt={title} loading="lazy" className="h-full w-full object-cover" />
				<div className="absolute inset-0 flex items-center justify-center bg-black/30">
					<Play className="h-5 w-5 fill-white text-white drop-shadow" />
				</div>
			</div>
			<div className="min-w-0 flex-1">
				<p className="text-foreground truncate text-sm font-medium">{title}</p>
				<p className="text-muted-foreground mt-0.5 text-xs">youtube.com</p>
			</div>
		</a>
	);
}

export function Youtube({
	id,
	title,
	caption,
	variant = 'embed',
	width = 'md',
	start,
}: YoutubeProps) {
	if (variant === 'inline') {
		return <InlineCard id={id} title={title} />;
	}

	const params = new URLSearchParams({
		rel: '0',
		modestbranding: '1',
		...(start ? { start: String(start) } : {}),
	});

	const src = `https://www.youtube-nocookie.com/embed/${id}?${params}`;
	const { className, style } = resolveWidth(width);

	return (
		<figure className={`my-8 ${className}`} style={style}>
			<div
				className="relative w-full overflow-hidden rounded-xl"
				style={{ paddingBottom: '56.25%' }}
			>
				<iframe
					src={src}
					title={title}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
					loading="lazy"
					referrerPolicy="strict-origin-when-cross-origin"
					className="absolute inset-0 h-full w-full"
				/>
			</div>
			{caption ? (
				<figcaption className="text-muted-foreground mt-3 text-center text-sm">
					{caption}
				</figcaption>
			) : null}
		</figure>
	);
}
