export function findLightboxImage(target: EventTarget | null): HTMLImageElement | null {
	if (!(target instanceof Element)) {
		return null;
	}

	const match = target.closest('[data-lightbox-image]');
	return match instanceof HTMLImageElement ? match : null;
}
