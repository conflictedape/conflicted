import type { ReactNode } from 'react';

interface CardGridProps {
	/** number of columns at the `sm` breakpoint and up; wraps to a single column on mobile */
	cols?: 2 | 3 | 4;
	children: ReactNode;
}

const colsClassName: Record<NonNullable<CardGridProps['cols']>, string> = {
	2: 'sm:grid-cols-2',
	3: 'sm:grid-cols-2 lg:grid-cols-3',
	4: 'sm:grid-cols-2 lg:grid-cols-4',
};

export function CardGrid({ cols = 3, children }: CardGridProps) {
	return (
		<div className={['my-8 grid grid-cols-1 gap-4', colsClassName[cols]].join(' ')}>{children}</div>
	);
}
