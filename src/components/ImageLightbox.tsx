import { useEffect, useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { findLightboxImage } from '@/lib/lightbox';

interface ActiveImage {
	src: string;
	alt: string;
}

export default function ImageLightbox() {
	const [active, setActive] = useState<ActiveImage | null>(null);

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			const image = findLightboxImage(event.target);
			if (!image) {
				return;
			}

			setActive({ src: image.currentSrc || image.src, alt: image.alt });
		};

		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, []);

	return (
		<Dialog.Root
			open={active !== null}
			onOpenChange={(open) => {
				if (!open) {
					setActive(null);
				}
			}}
		>
			<Dialog.Portal>
				<Dialog.Backdrop className="data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0 fixed inset-0 z-[100] bg-black/85" />
				<Dialog.Popup className="data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 fixed inset-0 z-[100] flex items-center justify-center p-4 outline-none">
					<Dialog.Close
						aria-label="Close image viewer"
						className="bg-background/80 text-foreground hover:bg-accent hover:text-accent-foreground fixed top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-none backdrop-blur-sm transition-colors outline-none"
					>
						<X className="h-5 w-5" />
					</Dialog.Close>
					{active ? (
						<TransformWrapper
							key={active.src}
							minScale={1}
							maxScale={8}
							centerOnInit
							doubleClick={{ mode: 'toggle' }}
						>
							<TransformComponent
								wrapperClass="!h-full !w-full touch-none"
								contentClass="!h-full !w-full flex items-center justify-center"
							>
								<img
									src={active.src}
									alt={active.alt}
									className="max-h-[85vh] max-w-[90vw] object-contain select-none"
									draggable={false}
								/>
							</TransformComponent>
						</TransformWrapper>
					) : null}
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
