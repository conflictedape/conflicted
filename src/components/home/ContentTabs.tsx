import { Tabs } from '@base-ui/react/tabs';

export interface ContentListItem {
	title: string;
	href: string;
	date: string;
	excerpt: string;
}

interface ContentTabsProps {
	articles: ContentListItem[];
	projects: ContentListItem[];
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

export function ContentTabs({ articles, projects }: ContentTabsProps) {
	if (!projects.length) {
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
			</Tabs.List>
			<Tabs.Panel value="articles" className="pt-2">
				<ItemList items={articles} />
			</Tabs.Panel>
			<Tabs.Panel value="projects" className="pt-2">
				<ItemList items={projects} />
			</Tabs.Panel>
		</Tabs.Root>
	);
}

export default ContentTabs;
