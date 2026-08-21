import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { RecencyGroup } from '@/lib/recency';
import type { LikedSong } from '../../scripts/sync/spotify.ts';

// Resolved from the project root (not import.meta.url) because Vite/Astro
// relocate this module during the build, which would otherwise break a
// path computed relative to the source file's original location.
const LIKED_SONGS_PATH = path.join(process.cwd(), 'src/data/liked-songs.json');

interface LikedSongsFile {
	syncedAt: string;
	groups: RecencyGroup<LikedSong>[];
}

function loadLikedSongGroups(): RecencyGroup<LikedSong>[] {
	try {
		const raw = readFileSync(LIKED_SONGS_PATH, 'utf-8');
		return (JSON.parse(raw) as LikedSongsFile).groups;
	} catch {
		// Not generated yet (e.g. local dev without the Spotify sync script having
		// run) — render with no liked tracks instead of failing the build.
		return [];
	}
}

export const LIKED_SONG_GROUPS: RecencyGroup<LikedSong>[] = loadLikedSongGroups();
