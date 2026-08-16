/**
 * Loads a third-party embed script exactly once and resolves when it's ready.
 * Shared by embed components (X, Reddit, ...) that hydrate a placeholder
 * blockquote into a rendered card via a platform-provided script.
 */
export function loadEmbedScript(src: string): Promise<void> {
	const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
	if (existing) {
		return new Promise((resolve) =>
			existing.addEventListener('load', () => resolve(), { once: true })
		)
	}

	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.async = true
		script.addEventListener('load', () => resolve(), { once: true })
		document.body.appendChild(script)
	})
}

/**
 * Reddit's embed script has no exposed re-processing function (unlike
 * `twttr.widgets.load()`), so the documented workaround is to remove and
 * re-append the script tag to force it to re-scan the DOM for new
 * `.reddit-embed-bq` blockquotes.
 */
export function reprocessEmbedScript(src: string) {
	document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)?.remove()
	const script = document.createElement('script')
	script.src = src
	script.async = true
	document.body.appendChild(script)
}
