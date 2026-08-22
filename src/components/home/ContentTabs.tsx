import { Star } from 'lucide-react';
import { Tabs } from '@base-ui/react/tabs';

export interface ContentListItem {
	title: string;
	href: string;
	date: string;
	excerpt: string;
}

export interface GameCardItem {
	title: string;
	url: string;
	coverUrl: string | null;
	rating: number | null;
}

interface ContentTabsProps {
	articles: ContentListItem[];
	projects: ContentListItem[];
	games: GameCardItem[];
}

function ItemList({ items }: { items: ContentListItem[] }) {
	if (!items.length) {
		return <p className="text-muted-foreground text-sm">Nothing here yet.</p>;
	}

	return (
		<ul className="divide-border divide-y">
			{items.map((item) => (
				<li key={item.href} className="py-4 first:pt-0">
					<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
						<a
							href={item.href}
							className="text-foreground hover:text-primary text-base font-semibold transition-colors"
						>
							{item.title}
						</a>
						<span className="text-muted-foreground shrink-0 text-sm">{item.date}</span>
					</div>
					<p className="text-muted-foreground mt-1 text-sm leading-6">{item.excerpt}</p>
				</li>
			))}
		</ul>
	);
}

/**
 * Renders a single star cell: empty, fully filled, or (for the one star
 * that straddles a half rating) half-filled via a primary-colored icon
 * clipped to 50% width layered over a muted outline icon. Clipping happens
 * per-star (not across the whole row), so it isn't thrown off by the gap
 * between stars.
 */
function StarCell({ fill }: { fill: 'empty' | 'half' | 'full' }) {
	if (fill === 'empty') {
		return <Star className="text-muted-foreground/40 h-3 w-3" />;
	}

	if (fill === 'full') {
		return <Star className="text-primary h-3 w-3 fill-current" />;
	}

	return (
		<span className="relative inline-block h-3 w-3">
			<Star className="text-muted-foreground/40 absolute inset-0 h-3 w-3" />
			<span className="absolute inset-0 w-1/2 overflow-hidden">
				<Star className="text-primary h-3 w-3 fill-current" />
			</span>
		</span>
	);
}

/**
 * Renders a 0–5 star rating in Backloggd's own style, using discrete
 * per-star icons (full / half / empty) rather than clipping the whole row
 * by a single percentage width (see `parseRating` in
 * scripts/sync/backloggd.ts for how ratings are derived, in 0.5 steps).
 */
function StarRating({ rating }: { rating: number }) {
	const clamped = Math.max(0, Math.min(5, rating));
	const fullStars = Math.floor(clamped);
	const hasHalfStar = clamped - fullStars >= 0.5;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<div className="inline-flex gap-0.5" role="img" aria-label={`Rated ${rating} out of 5 stars`}>
			{Array.from({ length: fullStars }).map((_, i) => (
				<StarCell key={`full-${i}`} fill="full" />
			))}
			{hasHalfStar ? <StarCell fill="half" /> : null}
			{Array.from({ length: emptyStars }).map((_, i) => (
				<StarCell key={`empty-${i}`} fill="empty" />
			))}
		</div>
	);
}

function GameCard({ game }: { game: GameCardItem }) {
	return (
		<a
			href={game.url}
			target="_blank"
			rel="noopener noreferrer"
			className="group block"
			aria-label={game.title}
		>
			<div className="border-border bg-muted aspect-3/4 overflow-hidden rounded-md border">
				{game.coverUrl ? (
					<img
						src={game.coverUrl}
						alt={game.title}
						loading="lazy"
						className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
					/>
				) : (
					<div className="text-muted-foreground flex h-full w-full items-center justify-center p-2 text-center text-xs">
						{game.title}
					</div>
				)}
			</div>
			<p className="text-foreground group-hover:text-primary mt-2 truncate text-sm font-semibold transition-colors">
				{game.title}
			</p>
			{game.rating != null ? (
				<div className="mt-1">
					<StarRating rating={game.rating} />
				</div>
			) : null}
		</a>
	);
}

function GameGrid({ games }: { games: GameCardItem[] }) {
	if (!games.length) {
		return <p className="text-muted-foreground text-sm">Nothing here yet.</p>;
	}

	return (
		<ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
			{games.map((game) => (
				<li key={game.url}>
					<GameCard game={game} />
				</li>
			))}
		</ul>
	);
}

export function ContentTabs({ articles, projects, games }: ContentTabsProps) {
	if (!projects.length && !games.length) {
		return (
			<div className="pt-2">
				<ItemList items={articles} />
			</div>
		);
	}

	return (
		<Tabs.Root defaultValue="articles">
			<Tabs.List className="border-border flex gap-6 border-b">
				<Tabs.Tab
					value="articles"
					className="text-muted-foreground data-active:text-primary data-active:border-primary -mb-px border-b-2 border-transparent py-3 text-sm font-semibold transition-colors"
				>
					{articles.length} Articles
				</Tabs.Tab>
				<Tabs.Tab
					value="projects"
					className="text-muted-foreground data-active:text-primary data-active:border-primary -mb-px border-b-2 border-transparent py-3 text-sm font-semibold transition-colors"
				>
					{projects.length} Projects
				</Tabs.Tab>
				<Tabs.Tab
					value="now"
					className="text-muted-foreground data-active:text-primary data-active:border-primary -mb-px border-b-2 border-transparent py-3 text-sm font-semibold transition-colors"
				>
					Now
				</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value="articles" className="pt-2">
				<ItemList items={articles} />
			</Tabs.Panel>
			<Tabs.Panel value="projects" className="pt-2">
				<ItemList items={projects} />
			</Tabs.Panel>
			<Tabs.Panel value="now" className="pt-4">
				<GameGrid games={games} />
			</Tabs.Panel>
		</Tabs.Root>
	);
}

export default ContentTabs;
