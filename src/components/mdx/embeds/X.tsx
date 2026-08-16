import { useEffect, useRef } from 'react'
import { loadEmbedScript } from '@/components/mdx/embeds/loadEmbedScript'
import { justifyClassName, resolveWidth, type Align, type MediaWidth } from '@/components/mdx/embeds/layout'

declare global {
	interface Window {
		twttr?: {
			widgets: { load: (el?: HTMLElement) => void }
		}
	}
}

const WIDGETS_SRC = 'https://platform.twitter.com/widgets.js'

interface XProps {
	/** Numeric tweet/post ID from the URL, e.g. "1234567890123456789" */
	id: string
	/** Handle without the @, used to build the tweet URL, e.g. "elonmusk" */
	user: string
	caption?: string
	width?: MediaWidth
	align?: Align
	/** Match the tweet embed theme to the surrounding page. */
	theme?: 'light' | 'dark'
}

export function X({ id, user, caption, width = 'md', align = 'center', theme = 'dark' }: XProps) {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		let cancelled = false
		loadEmbedScript(WIDGETS_SRC).then(() => {
			if (!cancelled && containerRef.current) window.twttr?.widgets.load(containerRef.current)
		})
		return () => {
			cancelled = true
		}
	}, [id, user, theme])

	const tweetUrl = `https://x.com/${user}/status/${id}`
	const { className, style } = resolveWidth(width)

	return (
		<figure className="my-8">
			{/* flex + justify controls alignment across the full prose width, without floating the block */}
			<div ref={containerRef} className={`flex w-full ${justifyClassName[align]}`}>
				<div className={className} style={style}>
					<blockquote className="twitter-tweet" data-theme={theme}>
						<a href={tweetUrl}>Loading post…</a>
					</blockquote>
				</div>
			</div>
			{caption ? (
				<figcaption className="text-muted-foreground mt-3 text-center text-sm">
					{caption}
				</figcaption>
			) : null}
		</figure>
	)
}
