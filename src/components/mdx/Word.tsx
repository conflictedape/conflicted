import { useEffect, useRef, useState } from 'react';
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
	// Base UI's tooltip hover interaction is mouse-only, so touch devices (mobile/tablet)
	// have no way to trigger it by hovering. Making the tooltip controlled lets us also
	// open/close it on tap. Touch browsers still synthesize compatibility mouse events
	// after a tap (mouseover/mouseout), which would otherwise immediately re-close a
	// tap-opened tooltip via the same hover logic — so on coarse/no-hover devices we
	// ignore hover-driven changes entirely and let taps be the only way to toggle it.
	const [open, setOpen] = useState(false);
	const canHoverRef = useRef(true);

	useEffect(() => {
		canHoverRef.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	}, []);

	return (
		<Tooltip
			open={open}
			onOpenChange={(next, eventDetails) => {
				if (!canHoverRef.current && eventDetails?.reason === 'trigger-hover') return;
				setOpen(next);
			}}
		>
			<TooltipTrigger
				render={<span />}
				tabIndex={0}
				delay={150}
				closeOnClick={false}
				onClick={() => {
					if (!canHoverRef.current) setOpen((prev) => !prev);
				}}
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
