import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';

/**
 * Which icon is visible is decided purely by CSS (the `dark:` variant),
 * keyed off the `.dark` class that `Layout.astro`'s blocking inline script
 * already applies to `<html>` before this component hydrates. Both icons
 * are always rendered with static classNames, so the server and client
 * markup for this component are byte-identical — there's no client-only
 * state (localStorage/matchMedia) feeding into what gets rendered, so
 * there's nothing for React to mismatch during hydration.
 */
export default function Navbar() {
	const toggleDark = () => {
		const next = !document.documentElement.classList.contains('dark');
		document.documentElement.classList.toggle('dark', next);
		localStorage.setItem('theme', next ? 'dark' : 'light');
	};

	return (
		<header className="border-border bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
			<nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<a
					href={import.meta.env.BASE_URL}
					className="text-primary font-mono text-lg font-bold tracking-tight"
				>
					Conflictedape<span className="text-foreground">.</span>
				</a>

				<Button
					variant="ghost"
					size="icon"
					onClick={toggleDark}
					aria-label="Toggle dark mode"
					className="h-8 w-8"
				>
					<Sun className="hidden h-4 w-4 dark:block" />
					<Moon className="block h-4 w-4 dark:hidden" />
				</Button>
			</nav>
		</header>
	);
}
