interface ImageProps {
	src: string;
	alt: string;
	caption?: string;
}

export function Image({ src, alt, caption }: ImageProps) {
	return (
		<figure className="border-border bg-card/50 my-8 overflow-hidden rounded-xl border p-3 shadow-sm">
			<img
				src={src}
				alt={alt}
				className="border-border w-full rounded-lg border object-cover"
				loading="lazy"
			/>
			{caption ? (
				<figcaption className="text-muted-foreground mt-3 text-center text-sm">
					{caption}
				</figcaption>
			) : null}
		</figure>
	);
}
