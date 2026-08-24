import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';

import { XIcon } from '@/components/icons/XIcon';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
	title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
	const [copied, setCopied] = useState(false);

	const shareOnX = () => {
		const shareUrl = window.location.href;
		const intent = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
		window.open(intent, '_blank', 'noopener,noreferrer');
	};

	const copyLink = async () => {
		await navigator.clipboard.writeText(window.location.href);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="flex items-center gap-2">
			<Button variant="outline" size="icon-sm" onClick={shareOnX} aria-label="Share on X">
				<XIcon className="h-3.5 w-3.5" />
			</Button>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={copyLink}
				aria-label="Copy link to this post"
			>
				{copied ? (
					<Check className="text-primary h-3.5 w-3.5" />
				) : (
					<Link2 className="h-3.5 w-3.5" />
				)}
			</Button>
			{copied ? <span className="text-muted-foreground text-xs">Copied!</span> : null}
		</div>
	);
}
