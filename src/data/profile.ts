export interface SocialLink {
	label: string;
	href: string;
	icon: 'github' | 'x' | 'mail';
}

export const PROFILE = {
	name: 'Conflicted Ape',
	tagline: 'Probably wrong, writing anyway',
	bio: [
		"Software engineer in India, mostly interested in system design, scaling things, and game dev. I rant here. I'm planning to post a lot of tech stuff too.",
		"I write about things that I've read, watched, or experienced first-hand. I might be wrong about things, my views might change as I grow older, or they won't.",
		"Read what interests you. If you want to argue, or rant back, I'm around.",
	],
	availabilityPrefix: 'Currently open to',
	availabilityHighlight: 'backend roles',
	location: 'Hyderabad, India',
	photo: {
		src: '/conflicted_ape.webp',
		placeholderInitials: 'CA',
		alt: 'Conflicted Ape',
		caption: "yeah, that's me..",
	},
	socialLinks: [
		{ label: 'GitHub', href: 'https://github.com/conflictedape', icon: 'github' },
		{ label: 'X', href: 'https://x.com/conflictedape', icon: 'x' },
		{ label: 'Email', href: 'mailto:conflictedapestudios@gmail.com', icon: 'mail' },
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
		yearsExperience: 4,
		githubStars: '',
	},
};
