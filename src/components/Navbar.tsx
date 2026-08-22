import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { withBase } from '@/lib/constants';

export default function Navbar() {
	const [dark, setDark] = useState(() => {
		if (typeof localStorage === 'undefined') {
			return true;
		}

		const stored = localStorage.getItem('theme');
		return stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
	});

	useEffect(() => {
		document.documentElement.classList.toggle('dark', dark);
	}, [dark]);

	const toggleDark = () => {
		const next = !dark;
		setDark(next);
		document.documentElement.classList.toggle('dark', next);
		localStorage.setItem('theme', next ? 'dark' : 'light');
	};

	return (
		<header className="border-border bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
			<nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<a href={withBase('')} className="text-primary font-mono text-lg font-bold tracking-tight">
					Conflictedape<span className="text-foreground">.</span>
				</a>

				<Button
					variant="ghost"
					size="icon"
					onClick={toggleDark}
					aria-label="Toggle dark mode"
					className="h-8 w-8"
				>
					{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
				</Button>
			</nav>
		</header>
	);
}
