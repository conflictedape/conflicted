type MediaWidth = 'sm' | 'md' | 'lg' | 'full' | number;

interface VideoProps {
	src: string;
	caption?: string;
	/**
	 * Width of the player.
	 * - 'sm'   → ~384px
	 * - 'md'   → ~672px
	 * - 'lg'   → ~896px
	 * - 'full' → 100% of the prose column (default)
	 * - number → exact pixel value, e.g. width={720}
	 */
	width?: MediaWidth;
	/** Show playback controls. Defaults to true. */
	controls?: boolean;
	/** Autoplay (forces muted — browsers require it). Defaults to false. */
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
}

function resolveWidth(width: MediaWidth): { className: string; style?: React.CSSProperties } {
	if (typeof width === 'number') return { className: 'mx-auto', style: { maxWidth: width } };
	const map = { sm: 'max-w-sm', md: 'max-w-2xl', lg: 'max-w-4xl', full: 'w-full' } as const;
	return { className: `mx-auto ${map[width]}` };
}

export function Video({
	src,
	caption,
	width = 'full',
	controls = true,
	autoplay = false,
	loop = false,
	muted = false,
}: VideoProps) {
	const { className, style } = resolveWidth(width);
	return (
		<figure className={`my-8 ${className}`} style={style}>
			{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
			<video
				src={src}
				controls={controls}
				autoPlay={autoplay}
				loop={loop}
				muted={muted || autoplay}
				playsInline
				preload="metadata"
				className="w-full rounded-lg"
			/>
			{caption ? (
				<figcaption className="text-muted-foreground mt-3 text-center text-sm">
					{caption}
				</figcaption>
			) : null}
		</figure>
	);
}
