/**
 * Fetches the authenticated user's Spotify "liked songs" and writes them to
 * src/data/liked-songs.json. Intended to run once a day in CI (see the
 * "sync-spotify" workflow), immediately before `astro build`, so the JSON is
 * baked into the static output. The file is git-ignored — it only needs to
 * exist on disk for the duration of a single build.
 *
 * Required env vars: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
 * Run locally with:  node --env-file=.env scripts/sync/spotify.ts
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const LIKED_TRACKS_URL = 'https://api.spotify.com/v1/me/tracks';
const PAGE_SIZE = 50;
const OUTPUT_PATH = path.join(import.meta.dirname, '../../src/data/liked-songs.json');

interface SpotifyImage {
	url: string;
	width: number | null;
	height: number | null;
}

interface SpotifyTrack {
	id: string;
	name: string;
	artists: { name: string }[];
	album: { name: string; images: SpotifyImage[] };
	external_urls: { spotify: string };
}

interface SavedTrackItem {
	added_at: string;
	track: SpotifyTrack;
}

interface SavedTracksPage {
	items: SavedTrackItem[];
	next: string | null;
	total: number;
}

export interface LikedSong {
	id: string;
	title: string;
	artist: string;
	album: string;
	coverUrl: string | null;
	url: string;
	addedAt: string;
}

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

async function getAccessToken(): Promise<string> {
	const clientId = requireEnv('SPOTIFY_CLIENT_ID');
	const clientSecret = requireEnv('SPOTIFY_CLIENT_SECRET');
	const refreshToken = requireEnv('SPOTIFY_REFRESH_TOKEN');

	const response = await fetch(TOKEN_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		}),
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(
			`Failed to refresh Spotify access token (${response.status}): ${body}\n` +
				'The refresh token may have expired (Spotify refresh tokens expire 180 days ' +
				'after authorization) — re-run the manual auth flow to generate a new one.',
		);
	}

	const data = (await response.json()) as { access_token: string };
	return data.access_token;
}

async function fetchAllLikedSongs(accessToken: string): Promise<LikedSong[]> {
	const songs: LikedSong[] = [];
	let url: string | null = `${LIKED_TRACKS_URL}?limit=${PAGE_SIZE}&offset=0`;

	while (url) {
		const response: Response = await fetch(url, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		if (!response.ok) {
			const body = await response.text();
			throw new Error(`Failed to fetch liked songs (${response.status}): ${body}`);
		}

		const page = (await response.json()) as SavedTracksPage;

		for (const item of page.items) {
			songs.push({
				id: item.track.id,
				title: item.track.name,
				artist: item.track.artists.map((artist) => artist.name).join(', '),
				album: item.track.album.name,
				coverUrl: item.track.album.images[0]?.url ?? null,
				url: item.track.external_urls.spotify,
				addedAt: item.added_at,
			});
		}

		url = page.next;
	}

	return songs;
}

async function main() {
	console.log('Refreshing Spotify access token...');
	const accessToken = await getAccessToken();

	console.log('Fetching liked songs...');
	const songs = await fetchAllLikedSongs(accessToken);

	await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
	await writeFile(
		OUTPUT_PATH,
		JSON.stringify({ syncedAt: new Date().toISOString(), songs }, null, 2),
	);

	console.log(`Wrote ${songs.length} liked songs to ${OUTPUT_PATH}`);
}

main().catch((error: unknown) => {
	console.error(error);
	process.exitCode = 1;
});
