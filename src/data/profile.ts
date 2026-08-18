export interface SocialLink {
	label: string;
	href: string;
	icon: 'github' | 'x' | 'mail';
}

export const PROFILE = {
	name: 'Conflicted Ape',
	tagline: 'Backend engineer, game-dev, occasional game-dev nerd.',
	bio: [
		"I love making ideas come to life with code. I'm a fan of computer architecture, scaling systems, and game dev.",
		"I've worked on various backend systems across a handful of small teams and side projects. You can find me sharing what I learn along the way, and personal rants ofc on this blog.",
	],
	availabilityPrefix: 'Currently open to',
	availabilityHighlight: 'backend and full-stack roles',
	location: 'India',
	photo: {
		/** No real photo yet — Hero.astro renders a square placeholder box (initials) instead of an <img>. */
		placeholderInitials: 'CA',
		alt: 'Conflicted Ape',
		caption: "yeah, that's me..",
	},
	socialLinks: [
		{ label: 'GitHub', href: 'https://github.com/conflictedape', icon: 'github' },
		{ label: 'X', href: 'https://x.com/conflictedape', icon: 'x' },
		{ label: 'Email', href: 'mailto:hello@conflictedape.dev', icon: 'mail' },
	] satisfies SocialLink[],
	skills: [
		'Rust',
		'Python',
		'TypeScript',
		'React',
		'PostgreSQL',
		'Redis',
		'Docker',
		'Linux',
		'GCP',
	],
	stats: {
		yearsExperience: 5,
		githubStars: '1k+',
	},
};
