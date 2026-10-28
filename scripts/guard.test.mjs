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
const WITHHELD = '(path withheld: contains a sensitive word)';

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
			'.github/note.yml 3',
			'dist/encoded.html 1',
			'dist/encoded.html 2',
			'dist/index.html 2',
			'dist/sitemap.xml 1',
			'docs/word.md 4',
			'public/private.txt 3',
			'src/path.mdx 1',
			'src/repo.mdx 3',
			'src/word.mdx 4',
		]);
	});
});

test('applies the email rule to HTML only', () => {
	withRepo('violations', (dir) => {
		const { stdout } = runGuard(dir, { GUARD_SENSITIVE_WORDS: VIRTUAL_WORD });
		assert.doesNotMatch(stdout, /contact\.txt/);
	});
});

test('prints a rule legend with the failure summary', () => {
	withRepo('violations', (dir) => {
		const { stderr } = runGuard(dir, { GUARD_SENSITIVE_WORDS: VIRTUAL_WORD });
		assert.match(stderr, /rules: 1 local absolute path, 2 email address, 3 private repository path, 4 sensitive word/);
	});
});

test('withholds a path that contains a sensitive word', () => {
	withRepo('clean', (dir) => {
		writeFileSync(join(dir, 'src', `${VIRTUAL_WORD}.txt`), 'clean content\n');
		execFileSync('git', ['add', '-A'], { cwd: dir });
		const { code, stdout, stderr } = runGuard(dir, { GUARD_SENSITIVE_WORDS: VIRTUAL_WORD });
		assert.notEqual(code, 0);
		assert.equal(stdout.trim(), `${WITHHELD} 4`);
		assert.ok(!(stdout + stderr).toLowerCase().includes(VIRTUAL_WORD));
	});
});

test('checks binary-looking tracked files for sensitive words as UTF-16', () => {
	withRepo('clean', (dir) => {
		writeFileSync(join(dir, 'src', 'utf16.txt'), Buffer.from(`note: ${VIRTUAL_WORD}\n`, 'utf16le'));
		execFileSync('git', ['add', '-A'], { cwd: dir });
		const { code, stdout } = runGuard(dir, { GUARD_SENSITIVE_WORDS: VIRTUAL_WORD });
		assert.notEqual(code, 0);
		assert.equal(stdout.trim(), 'src/utf16.txt 4');
	});
});

test('matches a multi-word phrase wrapped across lines', () => {
	withRepo('clean', (dir) => {
		writeFileSync(join(dir, 'src', 'wrap.mdx'), 'first fixture\nphrase here\n');
		execFileSync('git', ['add', '-A'], { cwd: dir });
		const { stdout } = runGuard(dir, { GUARD_SENSITIVE_WORDS: 'fixture phrase' });
		assert.equal(stdout.trim(), 'src/wrap.mdx 4');
	});
});

test('exits 2 without echoing content when the config is malformed', () => {
	withRepo('clean', (dir) => {
		writeFileSync(join(dir, 'guard.config.json'), `{ "broken": "${VIRTUAL_WORD}"`);
		const { code, stdout, stderr } = runGuard(dir, { GUARD_SENSITIVE_WORDS: VIRTUAL_WORD });
		assert.equal(code, 2);
		assert.equal(stdout, '');
		assert.match(stderr, /^guard: error: /);
		assert.ok(!stderr.toLowerCase().includes(VIRTUAL_WORD));
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
		assert.match(stdout, /^src\/path\.mdx 1$/m);
		assert.doesNotMatch(stdout, / 4$/m);
	});
});

test('locally warns when the env holds only comments', () => {
	withRepo('clean', (dir) => {
		const { code, stderr } = runGuard(dir, { GUARD_SENSITIVE_WORDS: '# none yet\n' });
		assert.equal(code, 0);
		assert.match(stderr, /warning: no sensitive words/);
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
