interface ImageProps {
	src: string;
	alt: string;
	caption?: string;
}

export function Image({ src, alt, caption }: ImageProps) {
	return (
		<figure className="my-8">
			<img src={src} alt={alt} className="w-full rounded-sm object-cover" loading="lazy" />
			{caption ? (
				<figcaption className="text-muted-foreground mt-3 text-center text-sm">
					{caption}
				</figcaption>
			) : null}
		</figure>
	);
}
