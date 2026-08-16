export type MediaWidth = 'sm' | 'md' | 'lg' | 'full' | number
export type Align = 'left' | 'center' | 'right'

export function resolveWidth(width: MediaWidth): {
	className: string
	style?: React.CSSProperties
} {
	if (typeof width === 'number') return { className: '', style: { maxWidth: width, width: '100%' } }
	const map = { sm: 'max-w-sm', md: 'max-w-xl', lg: 'max-w-2xl', full: 'max-w-none' } as const
	return { className: `w-full ${map[width]}` }
}

export const justifyClassName: Record<Align, string> = {
	left: 'justify-start',
	center: 'justify-center',
	right: 'justify-end',
}
