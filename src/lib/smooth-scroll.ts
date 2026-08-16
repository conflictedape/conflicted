// AI SLOP: gets the job done tho..
// Basically, scrolls between headers using a cubic-bezier curve I added
// But the hard part is calculating the duration for distance between headers
// if you instead use a fixed time interval.. scrolling from top to bottom header vs current header to next header takes the same interval of time. which is not good.

export type BezierTuple = [number, number, number, number];

export const DEFAULT_EASING: BezierTuple = [0.69, 0.22, 0.39, 0.95];

const NAVBAR_HEIGHT = 56; // 3.5rem = h-14
const SCROLL_OFFSET = 24;
const MIN_DURATION = 300;
const MAX_DURATION = 1200;
/** ms per pixel of scroll distance */
const MS_PER_PX = 0.4;

/**
 * Evaluate a cubic bezier at progress x using Newton-Raphson iteration.
 * Returns the easing output (y) for a given input (x ∈ [0, 1]).
 */
function cubicBezierY(x1: number, y1: number, x2: number, y2: number, x: number): number {
	const cx = 3 * x1;
	const bx = 3 * (x2 - x1) - cx;
	const ax = 1 - cx - bx;

	const cy = 3 * y1;
	const by = 3 * (y2 - y1) - cy;
	const ay = 1 - cy - by;

	const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
	const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
	const derivX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

	let t = x;
	for (let i = 0; i < 8; i++) {
		const dx = sampleX(t) - x;
		const d = derivX(t);
		if (Math.abs(d) < 1e-6) break;
		t -= dx / d;
	}

	return sampleY(t);
}

/**
 * Compute scroll duration proportional to the distance being covered.
 * Clamped between MIN_DURATION and MAX_DURATION.
 */
function durationForDistance(distancePx: number): number {
	return Math.min(MAX_DURATION, Math.max(MIN_DURATION, Math.abs(distancePx) * MS_PER_PX));
}

/**
 * Smoothly scroll to a heading element using a custom cubic bezier easing.
 * Duration is automatically derived from the scroll distance.
 */
export function scrollToHeading(element: HTMLElement, easing: BezierTuple = DEFAULT_EASING): void {
	const targetY =
		element.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - SCROLL_OFFSET;

	const startY = window.scrollY;
	const distance = targetY - startY;
	const duration = durationForDistance(distance);
	const startTime = performance.now();
	const [x1, y1, x2, y2] = easing;

	function step(now: number) {
		const elapsed = now - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const eased = cubicBezierY(x1, y1, x2, y2, progress);

		window.scrollTo(0, startY + distance * eased);

		if (progress < 1) requestAnimationFrame(step);
	}

	requestAnimationFrame(step);
}
