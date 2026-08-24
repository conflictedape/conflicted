import type { ReactNode } from 'react';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';

import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';

interface WordProps {
	/** the actual word or phrase being defined */
	children: ReactNode;
	/** pronunciation guide rendered before the word, e.g. "/həˈloʊ/" */
	phonetic?: string;
	/** definition shown inside the tooltip */
	meaning: string;
	/** optional image illustrating the word's meaning */
	image?: string;
	imageAlt?: string;
}

export function Word({ children, phonetic, meaning, image, imageAlt }: WordProps) {
	return (
		<Tooltip>
			<TooltipTrigger
				render={<span />}
				tabIndex={0}
				delay={150}
				className="bg-primary/10 hover:bg-primary/20 decoration-primary/70 focus-visible:ring-ring/50 cursor-help rounded-sm px-1 py-0.5 underline decoration-dotted underline-offset-4 transition-colors outline-none focus-visible:ring-3"
			>
				{phonetic ? (
					<span className="text-muted-foreground mr-1 font-mono text-[0.85em]">{phonetic}</span>
				) : null}
				{children}
			</TooltipTrigger>
			<TooltipPrimitive.Portal>
				<TooltipPrimitive.Positioner side="top" sideOffset={10} className="z-50">
					<TooltipPrimitive.Popup className="border-border bg-popover text-popover-foreground data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 w-72 max-w-[calc(100vw-2rem)] origin-(--transform-origin) overflow-hidden rounded-xl border shadow-lg">
						{image ? (
							<img
								src={image}
								alt={imageAlt ?? (typeof children === 'string' ? children : 'Illustration')}
								className="h-32 w-full object-cover"
								loading="lazy"
							/>
						) : null}
						<p className="p-3 text-sm leading-6">{meaning}</p>
					</TooltipPrimitive.Popup>
				</TooltipPrimitive.Positioner>
			</TooltipPrimitive.Portal>
		</Tooltip>
	);
}
