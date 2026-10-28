// Builds public/fonts/dwlg-sans/dwlg-sans.woff2: Pretendard Variable cut down
// to the characters this site's sources use, renamed to DWLG Sans because the
// OFL reserves the Pretendard name for unmodified versions. One small file
// replaces the 12–20 dynamic-subset slices a Korean page otherwise pulls in.
// Characters added later still render, because the dynamic subsets stay as
// the fallback family. Re-run after large content changes: pnpm run build && pnpm run subset-font,
// then build again so the new file is copied into dist.
import { existsSync } from 'node:fs';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import subsetFont from 'subset-font';
import wawoff2 from 'wawoff2';
import { readNames, renameFont } from './rename-font.mjs';

const SOURCE_FONT = 'node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2';
const OUTPUT = 'public/fonts/dwlg-sans/dwlg-sans.woff2';
// PostScript names (PretendardVariable-Bold) take no spaces.
const rename = (text) =>
	text.replaceAll('Pretendard Variable', 'DWLG Sans').replaceAll('PretendardVariable', 'DWLGSans').replaceAll('Pretendard', 'DWLG Sans');
const TEXT_EXTENSIONS = /\.(mdx?|astro|ts|mjs|css|html)$/;
// dist/ adds the UI strings Starlight renders, which do not live in src/.
const SOURCES = ['src', 'astro.config.mjs', 'dist'];

async function collectFiles(path) {
	if (TEXT_EXTENSIONS.test(path)) return [path];
	const entries = await readdir(path, { withFileTypes: true });
	const nested = await Promise.all(
		entries
			.filter((entry) => entry.isDirectory() || TEXT_EXTENSIONS.test(entry.name))
			.map((entry) => collectFiles(join(path, entry.name))),
	);
	return nested.flat();
}

if (!existsSync('dist')) {
	console.error('subset-font: dist/ not found. Run pnpm run build first.');
	process.exit(1);
}

const files = (await Promise.all(SOURCES.map(collectFiles))).flat();
const texts = await Promise.all(files.map((file) => readFile(file, 'utf8')));
const printableAscii = String.fromCharCode(...Array.from({ length: 95 }, (_, i) => i + 32));
const chars = new Set([...printableAscii, ...texts.join('')].filter((c) => c.codePointAt(0) >= 32));

const subset = await subsetFont(await readFile(SOURCE_FONT), [...chars].join(''), {
	targetFormat: 'sfnt',
});
const renamed = renameFont(subset, rename);
const leftover = readNames(renamed).filter(({ nameId, text }) => ![0, 7, 13, 14].includes(nameId) && text.includes('Pretendard'));
if (leftover.length) {
	console.error('subset-font: Pretendard name left in', leftover);
	process.exit(1);
}
const font = Buffer.from(await wawoff2.compress(renamed));
await writeFile(OUTPUT, font);
console.log(`${OUTPUT}: ${chars.size} characters, ${font.length} bytes`);
