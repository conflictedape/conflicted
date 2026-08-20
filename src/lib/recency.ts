import {
	differenceInCalendarMonths,
	differenceInCalendarYears,
	isSameMonth,
	isSameWeek,
} from 'date-fns';

export interface RecencyGroup<T> {
	label: string;
	items: T[];
}

interface GroupByRecencyOptions {
	/** Keep only the most recent N items (by date) before bucketing. */
	limit?: number;
	/** Reference "now" to bucket against. Defaults to the current time. */
	now?: Date;
}

/**
 * Buckets a list of dated items into recency groups — "This week", "Earlier
 * this month", "N months ago" (1-11), then "N years ago" thereafter —
 * keeping only the most recent `limit` items (if provided) before bucketing.
 *
 * Buckets are mutually exclusive (an item from this week is never also
 * counted in "Earlier this month"), which is why that bucket is named
 * "Earlier this month" rather than "This month" — it only holds the
 * remainder of the month not already covered by "This week".
 *
 * Groups with no items are omitted entirely, and the returned groups are
 * ordered from most to least recent. Weeks are calendar weeks starting on
 * Monday (not a rolling 7-day window).
 *
 * Used by both the Spotify and Backloggd sync scripts to shape their output
 * so the two data sources are grouped identically.
 */
export function groupByRecency<T>(
	items: readonly T[],
	getDate: (item: T) => string | Date,
	{ limit, now = new Date() }: GroupByRecencyOptions = {}
): RecencyGroup<T>[] {
	const sorted = [...items].sort(
		(a, b) => toDate(getDate(b)).getTime() - toDate(getDate(a)).getTime()
	);
	const limited = typeof limit === 'number' ? sorted.slice(0, limit) : sorted;

	const buckets = new Map<string, { order: number; items: T[] }>();

	for (const item of limited) {
		const { label, order } = classify(toDate(getDate(item)), now);
		const bucket = buckets.get(label);
		if (bucket) {
			bucket.items.push(item);
		} else {
			buckets.set(label, { order, items: [item] });
		}
	}

	return [...buckets.entries()]
		.sort(([, a], [, b]) => a.order - b.order)
		.map(([label, bucket]) => ({ label, items: bucket.items }));
}

function toDate(value: string | Date): Date {
	return typeof value === 'string' ? new Date(value) : value;
}

function classify(date: Date, now: Date): { label: string; order: number } {
	if (isSameWeek(date, now, { weekStartsOn: 1 })) {
		return { label: 'This week', order: 0 };
	}

	if (isSameMonth(date, now)) {
		return { label: 'Earlier this month', order: 1 };
	}

	const monthsAgo = differenceInCalendarMonths(now, date);
	if (monthsAgo >= 1 && monthsAgo < 12) {
		return { label: `${monthsAgo} month${monthsAgo === 1 ? '' : 's'} ago`, order: 1 + monthsAgo };
	}

	const yearsAgo = Math.max(1, differenceInCalendarYears(now, date));
	return { label: `${yearsAgo} year${yearsAgo === 1 ? '' : 's'} ago`, order: 12 + yearsAgo };
}
