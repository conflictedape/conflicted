export interface ProjectItem {
	title: string;
	href: string;
	date: string;
	excerpt: string;
}

export const PROJECTS: ProjectItem[] = [
	{
		title: 'This portfolio',
		href: 'https://github.com/conflictedape/portfolio',
		date: '2026-08-01',
		excerpt: 'An Astro + MDX personal site with a custom lightbox, TOC, and code-block tooling.',
	},
	{
		title: 'Placeholder Project Two',
		href: 'https://github.com/conflictedape/placeholder-two',
		date: '2026-05-14',
		excerpt:
			'Placeholder description — replace with a real project summary in src/data/projects.ts.',
	},
	{
		title: 'Placeholder Project Three',
		href: 'https://github.com/conflictedape/placeholder-three',
		date: '2026-02-20',
		excerpt:
			'Placeholder description — replace with a real project summary in src/data/projects.ts.',
	},
	{
		title: 'Placeholder Project Four',
		href: 'https://github.com/conflictedape/placeholder-four',
		date: '2025-11-03',
		excerpt:
			'Placeholder description — replace with a real project summary in src/data/projects.ts.',
	},
];
