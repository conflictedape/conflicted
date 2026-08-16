import type { ReactNode } from 'react'

interface CardProps {
	title: string
	/** emoji or short glyph shown next to the title */
	icon?: ReactNode
	/** how many grid columns this card should span, for wide/full-width cards */
	span?: 1 | 2 | 3 | 4
	children?: ReactNode
}

const spanClassName: Record<NonNullable<CardProps['span']>, string> = {
	1: '',
	2: 'sm:col-span-2',
	3: 'sm:col-span-3',
	4: 'sm:col-span-4',
}

export function Card({ title, icon, span = 1, children }: CardProps) {
	return (
		<div
			className={[
				'border-border bg-card flex h-full flex-col overflow-hidden rounded-xl border',
				spanClassName[span],
			].join(' ')}
		>
			<div className="border-border bg-muted/40 flex items-center gap-2 border-b px-4 py-3">
				{icon ? <span className="shrink-0 text-lg leading-none">{icon}</span> : null}
				<h3 className="text-foreground m-0 text-sm font-semibold">{title}</h3>
			</div>
			<div className="flex-1 px-4 py-4 text-sm leading-6 [&_a]:text-primary [&_a]:no-underline [&_a:hover]:underline [&_ol]:m-0 [&_p]:m-0 [&_p]:mb-2 [&_p]:font-medium [&_ul]:m-0 [&_ul]:list-none [&_ul]:space-y-1 [&_ul]:pl-4 [&_ul_li]:relative [&_ul_li]:pl-3 [&_ul_li]:before:absolute [&_ul_li]:before:top-2 [&_ul_li]:before:left-0 [&_ul_li]:before:h-1 [&_ul_li]:before:w-1 [&_ul_li]:before:rounded-full [&_ul_li]:before:bg-current [&_ul_li]:before:opacity-60">
				{children}
			</div>
		</div>
	)
}
