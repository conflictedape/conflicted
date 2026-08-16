import type { ReactNode } from 'react';
import { AlertTriangle, Info, Lightbulb, type LucideIcon, XCircle } from 'lucide-react';

interface CalloutProps {
	type: 'note' | 'tip' | 'warning' | 'danger';
	children: ReactNode;
}

interface CalloutConfig {
	icon: LucideIcon;
	label: string;
	containerClassName: string;
	iconClassName: string;
}

const calloutConfig: Record<CalloutProps['type'], CalloutConfig> = {
	note: {
		icon: Info,
		label: 'Note',
		containerClassName: 'border-l-primary bg-primary/10 text-foreground ring-primary/20',
		iconClassName: 'text-primary',
	},
	tip: {
		icon: Lightbulb,
		label: 'Tip',
		containerClassName: 'border-l-secondary bg-secondary/10 text-foreground ring-secondary/20',
		iconClassName: 'text-secondary',
	},
	warning: {
		icon: AlertTriangle,
		label: 'Warning',
		containerClassName: 'border-l-chart-3 bg-chart-3/10 text-foreground ring-chart-3/20',
		iconClassName: 'text-chart-3',
	},
	danger: {
		icon: XCircle,
		label: 'Danger',
		containerClassName:
			'border-l-destructive bg-destructive/10 text-foreground ring-destructive/20',
		iconClassName: 'text-destructive',
	},
};

export function Callout({ type, children }: CalloutProps) {
	const { icon: Icon, label, containerClassName, iconClassName } = calloutConfig[type];

	return (
		<div
			className={[
				'my-8 rounded-xl border border-l-4 px-5 py-4 shadow-sm ring-1',
				containerClassName,
			].join(' ')}
		>
			<div className="flex items-start gap-3">
				<Icon className={['mt-0.5 h-5 w-5 shrink-0', iconClassName].join(' ')} />
				<div className="space-y-2 text-sm leading-7 sm:text-base">
					<p className="font-semibold tracking-tight">{label}</p>
					<div className="text-muted-foreground [&_code]:text-foreground [&_p]:m-0">{children}</div>
				</div>
			</div>
		</div>
	);
}
