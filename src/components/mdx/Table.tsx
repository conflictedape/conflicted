import type { ReactNode } from 'react';

interface TableProps {
	children: ReactNode;
}

export function Table({ children }: TableProps) {
	return (
		<div className="border-border my-8 w-full overflow-x-auto rounded-xl border [-webkit-overflow-scrolling:touch]">
			<table className="w-full min-w-full border-collapse text-left text-sm">{children}</table>
		</div>
	);
}
