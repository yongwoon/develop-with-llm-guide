// Tests for scripts/fresh-check.mjs. The fixture pair under
// scripts/fixtures/fresh-check/ matches exactly; each CLI test copies it to a
// temp dir and changes one thing. All names are virtual.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { cellKeys, parseArguments, siteKeys, splitRow } from './fresh-check.mjs';

const SCRIPT = fileURLToPath(new URL('./fresh-check.mjs', import.meta.url));
const FIXTURE = fileURLToPath(new URL('./fixtures/fresh-check/', import.meta.url));

const args = (rows, after = '') =>
	['## Arguments', '', '| Parameter | Format |', '|---|---|', ...rows, after].join('\n');

const tempDirs = [];
after(() => tempDirs.forEach((dir) => rmSync(dir, { recursive: true, force: true })));

function withFixture(change) {
	const dir = mkdtempSync(join(tmpdir(), 'fresh-check-'));
	tempDirs.push(dir);
	cpSync(FIXTURE, dir, { recursive: true });
	change?.(dir);
	return dir;
}

function run(dir, source = join(dir, 'source')) {
	const result = spawnSync(process.execPath, [SCRIPT], {
		cwd: join(dir, 'site'),
		env: { ...process.env, FRESH_CHECK_SOURCE: source },
		encoding: 'utf8',
	});
	return { code: result.status, out: result.stdout, err: result.stderr };
}

const edit = (path, from, to) => {
	const text = readFileSync(path, 'utf8');
	assert.ok(text.includes(from), `fixture text not found: ${from}`);
	writeFileSync(path, text.replace(from, to));
};
const docs = (dir, file) => join(dir, 'site/src/content/docs', file);
const sourceFile = (dir, file) => join(dir, 'source/tools', file);

test('splitRow ignores pipes inside backticks and escaped pipes', () => {
	assert.deepEqual(splitRow('| `--format md|html` | `a\\|b` | x |'), ['`--format md|html`', '`a|b`', 'x']);
});

test('cellKeys: flags and aliases are keys, values are not, lone placeholders are positional', () => {
	assert.deepEqual(cellKeys('`--pr-lang` / `--lang`'), ['--pr-lang', '--lang']);
	assert.deepEqual(cellKeys('`--base <branch>`'), ['--base']);
	assert.deepEqual(cellKeys('`<PR#>`'), ['positional:<PR#>']);
	assert.deepEqual(cellKeys('<start>..<end>'), ['positional:<start>', 'positional:<end>']);
	assert.deepEqual(cellKeys('request (natural language)'), []);
});

test('parseArguments reads only the first table and stops at the next heading', () => {
	const result = parseArguments(args(['| `--a` | flag |', '| free text | text |'], '\n### Examples\n\n| P | F |\n|---|---|\n| `--b` | flag |'));
	assert.deepEqual([...result.keys], ['--a']);
	assert.equal(result.naturalRows, 1);
});

test('parseArguments: N/A is an empty set; separators may carry colons', () => {
	assert.equal(parseArguments('## Arguments\n\nN/A — no options.').keys.size, 0);
	assert.deepEqual([...parseArguments('## Arguments\n\n| P | F |\n|:--|--:|\n| `--a` | x |').keys], ['--a']);
});

test('parseArguments reports a missing section, table or separator', () => {
	assert.match(parseArguments('# Title').error, /no "## Arguments"/);
	assert.match(parseArguments('## Arguments\n\nSome prose.').error, /no table/);
	assert.match(parseArguments('## Arguments\n\n| P | F |\n| `--a` | x |').error, /separator/);
	assert.match(parseArguments('## Arguments\n\nProse.\n\n### Later\n\n| P | F |\n|---|---|\n| `--a` | x |').error, /no table/);
});

test('parseArguments flags delegation wording as a hint', () => {
	assert.deepEqual(parseArguments(args(['| `--skip` | flag | Caller-only |'])).hints, ['--skip']);
});

test('siteKeys splits aliases and keeps placeholders positional', () => {
	assert.deepEqual(siteKeys('--pr-lang / --lang'), ['--pr-lang', '--lang']);
	assert.deepEqual(siteKeys('<PR#>'), ['positional:<PR#>']);
});

test('matching fixture exits 0 and stays quiet about options the page already decided', () => {
	const result = run(withFixture());
	assert.equal(result.code, 0, result.out + result.err);
	assert.match(result.out, /차이 없음/);
	assert.doesNotMatch(result.out, /위임 문구 후보/);
	assert.match(result.out, /자연어 인자 행 1개/);
});

test('delegation hints show for a skill whose page is not written yet', () => {
	const result = run(withFixture((d) => rmSync(docs(d, 'skills/ywc-alpha.mdx'))));
	assert.match(result.out, /ywc-alpha claude-code 위임 문구 후보.*--skip-post-ci-check/);
});

const differences = [
	['missing option', (d) => edit(docs(d, 'skills/ywc-alpha.mdx'), '  - { name: --format, format: "md|html", when: w, tools: [claude-code] }\n', ''), /ywc-alpha: claude-code option 누락: --format/],
	['extra option', (d) => edit(docs(d, 'skills/ywc-gamma.mdx'), 'name: --x,', 'name: --y,'), /ywc-gamma: codex option 누락: --x[\s\S]*codex option 초과: --y/],
	['wrong option tool', (d) => edit(docs(d, 'skills/ywc-alpha.mdx'), 'name: --codex-only, format: flag, when: w, tools: [codex]', 'name: --codex-only, format: flag, when: w, tools: [claude-code]'), /claude-code option 초과: --codex-only/],
	['excluded option counts', (d) => edit(docs(d, 'skills/ywc-alpha.mdx'), 'excludedOptions: { claude-code: [--skip-post-ci-check] }\n', ''), /option 누락: --skip-post-ci-check/],
	['userInvoked', (d) => edit(docs(d, 'skills/ywc-beta.mdx'), 'userInvoked: { claude-code: true }\n', ''), /ywc-beta: claude-code userInvoked: site false \/ develop-with-llm true/],
	['codex policy', (d) => edit(sourceFile(d, 'codex-skill/skills/ywc-alpha/agents/openai.yaml'), 'true', 'false'), /ywc-alpha: codex userInvoked: site false/],
	['tools', (d) => edit(docs(d, 'skills/ywc-gamma.mdx'), 'tools: [codex]\nsummary', 'tools: [claude-code, codex]\nsummary'), /ywc-gamma: tools: site \[claude-code, codex\] \/ develop-with-llm \[codex\]/],
	['missing page', (d) => rmSync(docs(d, 'skills/ywc-beta.mdx')), /skill page 없음 1개: ywc-beta[\s\S]*그중 skill page 없음 1건/],
	['page without source', (d) => cpSync(docs(d, 'skills/ywc-beta.mdx'), docs(d, 'skills/ywc-delta.mdx')), /ywc-delta: develop-with-llm 에 없는 skill page/],
	['stale version', (d) => writeFileSync(sourceFile(d, 'codex-skill/VERSION'), '0.2.0\n'), /stale: skills\/ywc-gamma\.mdx codex 0\.1\.0 \(현재 0\.2\.0\)/],
	['agent missing', (d) => edit(docs(d, 'agents/workers.mdx'), '| `ywc-worker` | Codex | write-enabled |\n', ''), /agents: codex 누락: ywc-worker/],
	['agent extra', (d) => edit(docs(d, 'agents/workers.mdx'), '| `ywc-worker` | Codex |', '| `ywc-worker` | Claude Code · Codex |'), /agents: claude-code 초과: ywc-worker/],
	['claude agent missing', (d) => rmSync(sourceFile(d, 'claude-code/agents/ywc-helper.md')), /agents: claude-code 초과: ywc-helper/],
	['no agent page', (d) => rmSync(docs(d, 'agents/workers.mdx')), /agents: agent page 없음/],
	['broken Arguments', (d) => edit(sourceFile(d, 'codex-skill/skills/ywc-gamma/SKILL.md'), '## Arguments', '## Usage'), /ywc-gamma: codex Arguments parse error: no "## Arguments" section/],
];

for (const [name, change, expected] of differences) {
	test(`difference exits 1: ${name}`, () => {
		const result = run(withFixture(change));
		assert.equal(result.code, 1, result.out + result.err);
		assert.match(result.out, expected);
	});
}

test('skill arguments narrow the report and the exit code to those skills', () => {
	const dir = withFixture((d) => {
		rmSync(docs(d, 'skills/ywc-beta.mdx'));
		edit(docs(d, 'skills/ywc-gamma.mdx'), 'name: --x,', 'name: --y,');
	});
	const clean = spawnSync(process.execPath, [SCRIPT, 'ywc-alpha'], { cwd: join(dir, 'site'), env: { ...process.env, FRESH_CHECK_SOURCE: join(dir, 'source') }, encoding: 'utf8' });
	assert.equal(clean.status, 0, clean.stdout + clean.stderr);
	assert.doesNotMatch(clean.stdout, /ywc-beta|ywc-gamma|agents/);
	const dirty = spawnSync(process.execPath, [SCRIPT, 'ywc-gamma'], { cwd: join(dir, 'site'), env: { ...process.env, FRESH_CHECK_SOURCE: join(dir, 'source') }, encoding: 'utf8' });
	assert.equal(dirty.status, 1);
	assert.match(dirty.stdout, /ywc-gamma: codex option 초과: --y/);
	assert.doesNotMatch(dirty.stdout, /ywc-beta/);
	const unknown = spawnSync(process.execPath, [SCRIPT, 'ywc-nope'], { cwd: join(dir, 'site'), env: { ...process.env, FRESH_CHECK_SOURCE: join(dir, 'source') }, encoding: 'utf8' });
	assert.equal(unknown.status, 2);
	assert.match(unknown.stderr, /unknown skill: ywc-nope/);
});

test('site alias split keeps slashes inside placeholders', () => {
	assert.deepEqual(siteKeys('<owner/repo>'), ['positional:<owner/repo>']);
});

test('YAML errors name the file without echoing its text', () => {
	const result = run(withFixture((d) => writeFileSync(sourceFile(d, 'codex-skill/skills/ywc-gamma/agents/openai.yaml'), 'policy: [unclosed secret-text\n')));
	assert.equal(result.code, 2);
	assert.match(result.err, /cannot parse YAML in .*openai\.yaml/);
	assert.doesNotMatch(result.err, /secret-text/);
});

test('excluded helper skill is ignored', () => {
	const result = run(withFixture());
	assert.doesNotMatch(result.out, /ywc-shared-scripts/);
});

test('missing source exits 2 and names the env variable', () => {
	const dir = withFixture();
	const result = run(dir, join(dir, 'no-such-dir'));
	assert.equal(result.code, 2);
	assert.match(result.err, /not found.*FRESH_CHECK_SOURCE/);
});

test('unreadable source part exits 2', () => {
	const result = run(withFixture((d) => rmSync(sourceFile(d, 'claude-code/VERSION'))));
	assert.equal(result.code, 2);
	assert.match(result.err, /cannot read .*VERSION/);
});

test('the check writes nothing', () => {
	const dir = withFixture((d) => rmSync(docs(d, 'skills/ywc-beta.mdx')));
	const snapshot = () =>
		readdirSync(dir, { recursive: true })
			.map((path) => `${path}:${statSync(join(dir, path)).mtimeMs}`)
			.sort()
			.join('\n');
	const before = snapshot();
	run(dir);
	assert.equal(snapshot(), before);
});
