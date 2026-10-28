// Self-check for scripts/rename-font.mjs against a real Pretendard subset.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import subsetFont from 'subset-font';
import { readNames, renameFont } from './rename-font.mjs';

const SOURCE_FONT = new URL('../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2', import.meta.url);

test('renames naming records, keeps copyright, and stays a loadable font', async () => {
	const subset = await subsetFont(await readFile(SOURCE_FONT), '가a', { targetFormat: 'sfnt' });
	const renamed = renameFont(subset, (text) => text.replaceAll('Pretendard', 'Renamed'));
	const before = readNames(subset);
	const after = readNames(renamed);

	assert.equal(after.length, before.length);
	assert.equal(after.find((n) => n.nameId === 1).text, 'Renamed Variable');
	assert.equal(after.find((n) => n.nameId === 0).text, before.find((n) => n.nameId === 0).text);
	assert.ok(after.every((n) => !n.text.includes('Pretendard')));
	// Re-subsetting parses every table again, so a broken directory would throw.
	await subsetFont(renamed, 'a', { targetFormat: 'sfnt' });
});
