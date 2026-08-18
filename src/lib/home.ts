/**
 * Returns the first `n` items of `items` as a new array, without mutating
 * the input. Callers are responsible for sorting beforehand (e.g. by date).
 */
export function takeLatest<T>(items: T[], n: number): T[] {
	if (n <= 0) return [];
	return items.slice(0, n);
}
