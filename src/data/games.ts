import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { RecencyGroup } from '@/lib/recency';
import type { RatedGame } from '../../scripts/sync/backloggd.ts';

// Resolved from the project root (not import.meta.url) because Vite/Astro
// relocate this module during the build, which would otherwise break a
// path computed relative to the source file's original location.
const RATED_GAMES_PATH = path.join(process.cwd(), 'src/data/rated-games.json');

interface RatedGamesFile {
	syncedAt: string;
	groups: RecencyGroup<RatedGame>[];
}

function loadRatedGameGroups(): RecencyGroup<RatedGame>[] {
	try {
		const raw = readFileSync(RATED_GAMES_PATH, 'utf-8');
		return (JSON.parse(raw) as RatedGamesFile).groups;
	} catch {
		// Not generated yet (e.g. local dev without the Backloggd sync script
		// having run) — render with no rated games instead of failing the build.
		return [];
	}
}

export const RATED_GAME_GROUPS: RecencyGroup<RatedGame>[] = loadRatedGameGroups();
