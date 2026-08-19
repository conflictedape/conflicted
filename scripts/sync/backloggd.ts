/**
 * Scrapes the "reviews" tab of a public Backloggd profile and writes the
 * result to src/data/rated-games.json. Backloggd has no public API, so this
 * parses server-rendered HTML — plain HTTP requests work fine for this page
 * (no headless browser needed), unlike some other Backloggd routes (e.g.
 * /games/) which are placed behind an anti-scraping JS challenge.
 *
 * The reviews tab is already sorted "Recent" (most recently rated/reviewed
 * first) by default, which matches what we want for a "recently rated" feed.
 *
 * Required env var: BACKLOGGD_PROFILE_ID
 * Run locally with:  node --env-file=.env scripts/sync/backloggd.ts
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const OUTPUT_PATH = path.join(import.meta.dirname, '../../src/data/rated-games.json');
const USER_AGENT = 'Mozilla/5.0 (compatible; portfolio-sync-bot/1.0)';

export interface RatedGame {
	reviewId: string;
	title: string;
	url: string;
	coverUrl: string | null;
	releaseYear: string | null;
	rating: number | null;
	status: string | null;
	platform: string | null;
	reviewText: string | null;
	ratedAt: string;
}

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

function parseRating($card: cheerio.Cheerio<unknown>): number | null {
	const style = $card.find('.stars-top').attr('style');
	const match = style?.match(/width:\s*(\d+(?:\.\d+)?)%/);
	if (!match?.[1]) return null;
	// Star widths are given in 10% steps over a 5-star bar (100% = 5 stars).
	return Number(match[1]) / 20;
}

async function fetchReviewsPage(
	profileId: string,
	page: number,
): Promise<{ games: RatedGame[]; hasNextPage: boolean }> {
	const url = `https://backloggd.com/u/${profileId}/reviews?page=${page}`;
	const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });

	if (!response.ok) {
		throw new Error(`Failed to fetch Backloggd reviews page ${page} (${response.status})`);
	}

	const html = await response.text();
	const $ = cheerio.load(html);

	const games: RatedGame[] = [];

	$('.review-card').each((_, el) => {
		const $card = $(el);
		const $gameHeader = $card.prevAll('.game-name').first();

		const reviewId = $card.find('[review_id]').first().attr('review_id') ?? '';
		const title = $gameHeader.find('h3').text().trim();
		const relativeUrl = $gameHeader.find('a').first().attr('href') ?? '';
		const releaseYear = $gameHeader.find('.game-date').text().trim() || null;
		const coverUrl = $card.find('.game-cover img').attr('src') ?? null;
		const rating = parseRating($card);
		const status = $card.find('.game-status p').first().text().trim() || null;
		const platform = $card.find('.review-platform p').first().text().trim() || null;
		const reviewText = $card.find('.review-body .card-text').first().text().trim() || null;
		const ratedAt = $card.find('time[datetime]').first().attr('datetime') ?? '';

		if (!reviewId || !title || !ratedAt) return;

		games.push({
			reviewId,
			title,
			url: relativeUrl ? `https://backloggd.com${relativeUrl}` : '',
			coverUrl,
			releaseYear,
			rating,
			status,
			platform,
			reviewText,
			ratedAt,
		});
	});

	const hasNextPage = $('.pagy.nav').find(`a[href*="page=${page + 1}"]`).length > 0;

	return { games, hasNextPage };
}

async function fetchAllRatedGames(profileId: string): Promise<RatedGame[]> {
	const games: RatedGame[] = [];
	let page = 1;
	let hasNextPage = true;

	while (hasNextPage) {
		const result = await fetchReviewsPage(profileId, page);
		games.push(...result.games);
		hasNextPage = result.hasNextPage;
		page += 1;
	}

	return games;
}

async function main() {
	const profileId = requireEnv('BACKLOGGD_PROFILE_ID');

	console.log(`Fetching rated games for Backloggd profile "${profileId}"...`);
	const games = await fetchAllRatedGames(profileId);

	await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
	await writeFile(
		OUTPUT_PATH,
		JSON.stringify({ syncedAt: new Date().toISOString(), games }, null, 2),
	);

	console.log(`Wrote ${games.length} rated games to ${OUTPUT_PATH}`);
}

main().catch((error: unknown) => {
	console.error(error);
	process.exitCode = 1;
});
