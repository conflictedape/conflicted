import { Children, isValidElement, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CodeBlockProps {
	children: ReactNode;
	filename?: string;
	language?: string;
}

interface ChildProps {
	children?: ReactNode;
}

function getTextContent(node: ReactNode): string {
	if (typeof node === 'string' || typeof node === 'number') {
		return String(node);
	}

	if (Array.isArray(node)) {
		return node.map((child) => getTextContent(child)).join('');
	}

	if (isValidElement(node)) {
		return getTextContent((node.props as ChildProps).children);
	}

	return '';
}

export function CodeBlock({ children, filename, language }: CodeBlockProps) {
	const [copied, setCopied] = useState(false);
	const code = useMemo(
		() =>
			Children.toArray(children)
				.map((child) => getTextContent(child))
				.join(''),
		[children]
	);

	const copyCode = async () => {
		if (!code) {
			return;
		}

		await navigator.clipboard.writeText(code);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="border-border bg-card my-8 overflow-hidden rounded-xl border shadow-sm">
			<div className="border-border bg-muted/50 flex items-center justify-between gap-3 border-b px-4 py-3">
				<div className="flex min-w-0 items-center gap-3">
					<span className="bg-primary/80 h-2.5 w-2.5 rounded-full" />
					<span className="bg-chart-3/80 h-2.5 w-2.5 rounded-full" />
					<span className="bg-destructive/80 h-2.5 w-2.5 rounded-full" />
					{filename ? (
						<span className="text-foreground truncate text-sm font-medium">{filename}</span>
					) : null}
				</div>
				<div className="flex items-center gap-2">
					{language ? (
						<span className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-xs">
							{language}
						</span>
					) : null}
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => void copyCode()}
						className="gap-2"
						aria-label="Copy code block"
					>
						{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
						<span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
					</Button>
				</div>
			</div>
			<pre className="text-foreground wrap-break-words p-4 text-sm leading-7 whitespace-pre-wrap">
				<code>{children}</code>
			</pre>
		</div>
	);
}
