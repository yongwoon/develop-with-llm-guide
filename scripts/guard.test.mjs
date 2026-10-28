// Self-check for scripts/guard.mjs. Each case copies a fixture into a temporary
// git repository (fixture `build/` becomes `dist/`) and runs the guard CLI there
// with the real guard.config.json.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, renameSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(SCRIPTS_DIR, '..');
const GUARD = join(SCRIPTS_DIR, 'guard.mjs');
const VIRTUAL_WORD = 'fixture-secret-word';
const MATCHED_STRINGS = ['someone@example.com', '/Users/fixture-user', 'develop-with-llm/prompts', VIRTUAL_WORD];

function makeRepo(fixture) {
	const dir = mkdtempSync(join(tmpdir(), 'guard-test-'));
	cpSync(join(SCRIPTS_DIR, 'fixtures', 'guard', fixture), dir, { recursive: true });
	if (existsSync(join(dir, 'build'))) renameSync(join(dir, 'build'), join(dir, 'dist'));
	cpSync(join(REPO_ROOT, 'guard.config.json'), join(dir, 'guard.config.json'));
	execFileSync('git', ['init', '-q'], { cwd: dir });
	execFileSync('git', ['add', '-A'], { cwd: dir });
	return dir;
}

function runGuard(dir, env) {
	const baseEnv = { PATH: process.env.PATH, HOME: process.env.HOME };
	const result = spawnSync(process.execPath, [GUARD], { cwd: dir, env: { ...baseEnv, ...env }, encoding: 'utf8' });
	return { code: result.status, stdout: result.stdout, stderr: result.stderr };
}

function withRepo(fixture, fn) {
	const dir = makeRepo(fixture);
	try {
		return fn(dir);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
}

test('detects every rule and reports only path and rule number', () => {
	withRepo('violations', (dir) => {
		const { code, stdout } = runGuard(dir, { GUARD_SENSITIVE_WORDS: VIRTUAL_WORD });
		assert.notEqual(code, 0);
		assert.deepEqual(stdout.trim().split('\n'), [
			'dist/index.html 2',
			'public/private.txt 3',
			'src/path.mdx 1',
			'src/word.mdx 4',
		]);
	});
});

test('skips dist/pagefind and general patterns outside src, public, .github', () => {
	withRepo('violations', (dir) => {
		const { stdout } = runGuard(dir, { GUARD_SENSITIVE_WORDS: VIRTUAL_WORD });
		assert.doesNotMatch(stdout, /pagefind|docs\/rules\.md/);
	});
});

test('never prints matched strings or sensitive words', () => {
	withRepo('violations', (dir) => {
		const { stdout, stderr } = runGuard(dir, { GUARD_SENSITIVE_WORDS: VIRTUAL_WORD });
		const output = (stdout + stderr).toLowerCase();
		for (const matched of MATCHED_STRINGS) assert.ok(!output.includes(matched.toLowerCase()), `leaked: rule match`);
	});
});

test('passes allowlisted strings', () => {
	withRepo('allowlist', (dir) => {
		const { code, stdout } = runGuard(dir, { GUARD_SENSITIVE_WORDS: VIRTUAL_WORD });
		assert.equal(code, 0);
		assert.equal(stdout, '');
	});
});

test('passes a clean tree, including the public guide repository URL', () => {
	withRepo('clean', (dir) => {
		assert.equal(runGuard(dir, { GUARD_SENSITIVE_WORDS: VIRTUAL_WORD }).code, 0);
	});
});

test('fails closed in CI when the secret is missing, empty, or has no words', () => {
	withRepo('clean', (dir) => {
		assert.notEqual(runGuard(dir, { GITHUB_ACTIONS: 'true' }).code, 0);
		assert.notEqual(runGuard(dir, { GITHUB_ACTIONS: 'true', GUARD_SENSITIVE_WORDS: '' }).code, 0);
		assert.notEqual(runGuard(dir, { GITHUB_ACTIONS: 'true', GUARD_SENSITIVE_WORDS: '# comment\n\n' }).code, 0);
	});
});

test('in CI ignores the local word file so it cannot mask a missing secret', () => {
	withRepo('clean', (dir) => {
		writeFileSync(join(dir, 'guard-words.local.txt'), `${VIRTUAL_WORD}\n`);
		assert.notEqual(runGuard(dir, { GITHUB_ACTIONS: 'true', GUARD_SENSITIVE_WORDS: '' }).code, 0);
	});
});

test('locally warns without words and still checks general patterns', () => {
	withRepo('violations', (dir) => {
		const { code, stdout, stderr } = runGuard(dir, {});
		assert.notEqual(code, 0);
		assert.match(stderr, /warning: no sensitive words/);
		assert.doesNotMatch(stdout, / 4$/m);
	});
});

test('reads the local word file and normalizes CRLF, comments, case, and NFC', () => {
	withRepo('clean', (dir) => {
		writeFileSync(join(dir, 'src', 'cafe.mdx'), 'menu: CAFÉ\n');
		execFileSync('git', ['add', '-A'], { cwd: dir });
		writeFileSync(join(dir, 'guard-words.local.txt'), '# words\r\n\r\ncafé\r\n');
		const { code, stdout } = runGuard(dir, {});
		assert.notEqual(code, 0);
		assert.equal(stdout.trim(), 'src/cafe.mdx 4');
	});
});

test('fails when dist is missing', () => {
	withRepo('clean', (dir) => {
		rmSync(join(dir, 'dist'), { recursive: true });
		assert.notEqual(runGuard(dir, { GUARD_SENSITIVE_WORDS: VIRTUAL_WORD }).code, 0);
	});
});
