import { useEffect, useMemo, useRef, useState } from 'react';

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
	}

	function handleTopClick(e: React.MouseEvent<HTMLAnchorElement>) {
		e.preventDefault();
		clickScrollingRef.current = true;
		setActiveSlug(TOP_SLUG);
		scrollToTop(easingRef.current);
		history.pushState(null, '', window.location.pathname + window.location.search);
	}

	return (
		<aside className="border-border bg-card/60 sticky top-24 rounded-xl border p-5 shadow-sm backdrop-blur">
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
		</aside>
	);
}
