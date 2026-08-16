import { toString as mdastToString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';

/**
 * Remark plugin that computes reading time from the parsed Markdown AST.
 * idea yanked from here: https://github.com/Xetera/xetera.dev/blob/543f6d24fbcede3d962f27ad945085cdea9dd9ee/markdown-utils.js
 *
 * Why AST over post.body:
 * - `post.body` is raw MDX source, it includes JSX tags, import statements,
 *   component prop names, etc. which bloat the naive word count.
 * - `mdast-util-to-string` walks the tree and extracts only real prose: headings,
 *   paragraphs, list items — skipping code blocks, imports, and JSX.
 * - Runs once at build time during the remark pipeline; result is added to frontmatter
 */
export function remarkReadingTime() {
	return function (tree: Root, file: VFile) {
		const { data } = file;
		const text = mdastToString(tree, { includeImageAlt: false });
		const { text: readingTime } = getReadingTime(text);

		data.astro!.frontmatter!.readingTime = readingTime;
	};
}
