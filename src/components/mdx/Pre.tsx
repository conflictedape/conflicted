import type { HTMLAttributes, ReactNode } from 'react';

interface PreProps extends HTMLAttributes<HTMLPreElement> {
	'data-filename'?: string;
	// Shiki emits tabindex as lowercase HTML attribute; destructure to avoid React DOM warning
	tabindex?: string | number;
	children?: ReactNode;
}

export function Pre({
	children,
	'data-filename': filename,
	className,
	style,
	tabIndex: _tabIndex,
	tabindex: _tabindex,
	...rest
}: PreProps) {
	return (
		<div className="my-8">
			{filename ? (
				<p className="text-muted-foreground mb-2 truncate text-xs font-medium">{filename}</p>
			) : null}

			<pre className={className} style={style} {...rest}>
				{children}
			</pre>
		</div>
	);
}
