import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

const navLinks: { label: string; href: string }[] = [
	{ label: 'Blog', href: `${import.meta.env.BASE_URL}blog/` },
];

export default function Navbar() {
	const [dark, setDark] = useState(() => {
		if (typeof localStorage === 'undefined') {
			return true;
		}

		const stored = localStorage.getItem('theme');
		return stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
	});
	const [menuOpen, setMenuOpen] = useState(false);

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
			<nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
				<a
					href={import.meta.env.BASE_URL}
					className="text-primary font-mono text-lg font-bold tracking-tight"
				>
					Conflictedape<span className="text-foreground">.</span>
				</a>

				<ul className="hidden items-center gap-6 md:flex">
					{navLinks.map((link) => (
						<li key={link.href}>
							<a
								href={link.href}
								className="text-muted-foreground hover:text-foreground font-mono text-sm transition-colors"
							>
								{link.label}
							</a>
						</li>
					))}
				</ul>

				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleDark}
						aria-label="Toggle dark mode"
						className="h-8 w-8"
					>
						{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 md:hidden"
						onClick={() => setMenuOpen((open) => !open)}
						aria-label="Toggle menu"
					>
						{menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
					</Button>
				</div>
			</nav>

			{menuOpen ? (
				<div className="border-border bg-background border-t px-4 py-3 md:hidden">
					<ul className="flex flex-col gap-3">
						{navLinks.map((link) => (
							<li key={link.href}>
								<a
									href={link.href}
									className="text-muted-foreground hover:text-foreground font-mono text-sm"
									onClick={() => setMenuOpen(false)}
								>
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</header>
	);
}
