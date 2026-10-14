import { useEffect, useMemo, useRef, useState } from 'react';
import { ListTree, X } from 'lucide-react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
	DEFAULT_EASING,
	scrollToHeading,
	scrollToTop,
	type BezierTuple,
} from '@/lib/smooth-scroll';

interface Heading {
	depth: number;
	slug: string;
	text: string;
}

interface TOCProps {
	headings: Heading[];
	scrollEasing?: BezierTuple;
}

// Sentinel slug representing "top of the page" (before any heading), so the
// "On this page" label can be highlighted/clicked the same way as a heading.
const TOP_SLUG = '__top__';

export function TOC({ headings, scrollEasing = DEFAULT_EASING }: TOCProps) {
	const filteredHeadings = useMemo(
		() => headings.filter((heading) => heading.depth === 2 || heading.depth === 3),
		[headings]
	);
	const [activeSlug, setActiveSlug] = useState(TOP_SLUG);
	// Only used below the `lg` breakpoint, where the sidebar collapses into a
	// floating button that opens the same table of contents in a bottom sheet.
	const [drawerOpen, setDrawerOpen] = useState(false);
	const easingRef = useRef(scrollEasing);
	easingRef.current = scrollEasing;
	const clickScrollingRef = useRef(false);
	const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (!filteredHeadings.length) return;

		function getActiveSlug() {
			// last heading whose top edge has passed 100px into the viewport
			let active: string | null = null;
			for (const { slug } of filteredHeadings) {
				const el = document.getElementById(slug);
				if (!el) continue;
				if (el.getBoundingClientRect().top <= 100) active = slug;
			}
			return active;
		}

		function onScroll() {
			// during a click-triggered scroll, the optimistic state is already set;
			// wait until scrolling settles then confirm with geometry
			if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
			scrollEndTimerRef.current = setTimeout(() => {
				clickScrollingRef.current = false;
				const slug = getActiveSlug();
				setActiveSlug(slug ?? TOP_SLUG);
			}, 150);
		}

		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', onScroll);
			if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
		};
	}, [filteredHeadings]);

	if (!filteredHeadings.length) return null;

	function handleClick(e: React.MouseEvent<HTMLAnchorElement>, slug: string) {
		e.preventDefault();
		const target = document.getElementById(slug);
		if (!target) return;
		// Option 1: optimistically highlight the clicked item immediately
		clickScrollingRef.current = true;
		setActiveSlug(slug);
		scrollToHeading(target, easingRef.current);
		history.pushState(null, '', `#${slug}`);
		setDrawerOpen(false);
	}

	function handleTopClick(e: React.MouseEvent<HTMLAnchorElement>) {
		e.preventDefault();
		clickScrollingRef.current = true;
		setActiveSlug(TOP_SLUG);
		scrollToTop(easingRef.current);
		history.pushState(null, '', window.location.pathname + window.location.search);
		setDrawerOpen(false);
	}

	const navContent = (
		<>
			<a
				href="#"
				onClick={handleTopClick}
				className={[
					'mb-4 block text-sm font-semibold tracking-[0.2em] uppercase transition-colors',
					activeSlug === TOP_SLUG ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
				].join(' ')}
			>
				On this page
			</a>
			<nav aria-label="Table of contents">
				<ol className="space-y-2">
					{filteredHeadings.map((heading) => {
						const isActive = heading.slug === activeSlug;
						return (
							<li key={heading.slug} className={heading.depth === 3 ? 'pl-4' : ''}>
								<a
									href={`#${heading.slug}`}
									onClick={(e) => handleClick(e, heading.slug)}
									className={[
										'block text-sm transition-colors',
										isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
									].join(' ')}
								>
									{heading.text}
								</a>
							</li>
						);
					})}
				</ol>
			</nav>
		</>
	);

	return (
		<>
			{/* Desktop: sticky sidebar, always visible */}
			<aside className="border-border bg-card/60 sticky top-24 hidden rounded-xl border p-5 shadow-sm backdrop-blur lg:block">
				{navContent}
			</aside>

			{/* Mobile/tablet: floating button that opens the same TOC in a bottom sheet */}
			<button
				type="button"
				onClick={() => setDrawerOpen(true)}
				aria-label="Open table of contents"
				className="border-border bg-card text-foreground fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition-transform hover:scale-105 active:scale-95 lg:hidden"
			>
				<ListTree className="h-5 w-5" />
			</button>

			<Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
				<DialogContent
					showCloseButton={false}
					className="top-auto bottom-0 left-0 max-h-[70vh] w-full max-w-full translate-x-0 translate-y-0 overflow-y-auto rounded-t-2xl rounded-b-none p-5 sm:max-w-full"
				>
					<div className="mb-2 flex items-center justify-between">
						<DialogTitle className="text-sm font-semibold tracking-[0.2em] uppercase">
							Table of contents
						</DialogTitle>
						<button
							type="button"
							onClick={() => setDrawerOpen(false)}
							aria-label="Close table of contents"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							<X className="h-5 w-5" />
						</button>
					</div>
					{navContent}
				</DialogContent>
			</Dialog>
		</>
	);
}
