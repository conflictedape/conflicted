type MediaWidth = 'sm' | 'md' | 'lg' | 'full' | number;

interface GifProps {
	src: string;
	caption?: string;
	/**
	 * Width of the gif.
	 * - 'sm'   → ~384px
	 * - 'md'   → ~672px
	 * - 'lg'   → ~896px
	 * - 'full' → 100% of the prose column (default)
	 * - number → exact pixel value, e.g. width={480}
	 */
	width?: MediaWidth;
}

function resolveWidth(width: MediaWidth): { className: string; style?: React.CSSProperties } {
	if (typeof width === 'number') return { className: 'mx-auto', style: { maxWidth: width } };
	const map = { sm: 'max-w-sm', md: 'max-w-2xl', lg: 'max-w-4xl', full: 'w-full' } as const;
	return { className: `mx-auto ${map[width]}` };
}

export function Gif({ src, caption, width = 'full' }: GifProps) {
	const { className, style } = resolveWidth(width);
	return (
		<figure className={`my-8 ${className}`} style={style}>
			<img src={src} alt={caption ?? ''} loading="lazy" className="w-full rounded-lg" />
			{caption ? (
				<figcaption className="text-muted-foreground mt-3 text-center text-sm">
					{caption}
				</figcaption>
			) : null}
		</figure>
	);
}
