#!/usr/bin/env node
// Public guard (spec R-GUARD): fails when published output or tracked files
// contain forbidden strings. Prints only "<path> <rule>" lines on stdout and
// never echoes the matched text or the sensitive word list.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const CONFIG_FILE = 'guard.config.json';
const LOCAL_WORDS_FILE = 'guard-words.local.txt';
const WORDS_ENV = 'GUARD_SENSITIVE_WORDS';
const BINARY_SNIFF_BYTES = 8000;
const SENSITIVE_WORD_NAME = 'sensitive word';
const WHOLE_WORD_PREFIX = '=';
const WITHHELD_PREFIX = 'withheld-path-';
const withheldIds = new Map();
const HTML_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

const root = process.cwd();
const isCi = process.env.GITHUB_ACTIONS === 'true';

const toPosix = (path) => path.split(sep).join('/');
const normalize = (text) => text.normalize('NFC').toLowerCase().replace(/\s+/g, ' ');

class GuardExit extends Error {
	constructor(message, code) {
		super(message);
		this.exitCode = code;
	}
}

// A line starting with WHOLE_WORD_PREFIX matches only as a whole word, so a
// short word does not hit inside longer common words. Other lines match as
// substrings.
function parseWords(text) {
	return text
		.split('\n')
		.map((line) => line.replace(/\r$/, '').trim())
		.filter((line) => line !== '' && !line.startsWith('#'))
		.map(toMatcher)
		.filter(Boolean);
}

function toMatcher(line) {
	const isWholeWord = line.startsWith(WHOLE_WORD_PREFIX);
	const word = normalize(isWholeWord ? line.slice(WHOLE_WORD_PREFIX.length).trim() : line);
	if (word === '') return null;
	if (!isWholeWord) return (text) => text.includes(word);
	const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const regex = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`);
	return (text) => regex.test(text);
}

// CI reads only the secret env so a developer's local file can never mask a
// missing secret (fail-closed). Locally the env wins when set, for tests.
function loadWords() {
	const fromEnv = process.env[WORDS_ENV] ?? '';
	if (isCi) {
		const words = parseWords(fromEnv);
		if (words.length === 0) throw new GuardExit(`${WORDS_ENV} is missing or has no words (fail-closed in CI)`, 1);
		return words;
	}
	const localPath = join(root, LOCAL_WORDS_FILE);
	const source = fromEnv.trim() !== '' ? fromEnv : existsSync(localPath) ? readFileSync(localPath, 'utf8') : '';
	const words = parseWords(source);
	if (words.length === 0) {
		process.stderr.write(`guard: warning: no sensitive words loaded (${LOCAL_WORDS_FILE} or ${WORDS_ENV}); checking general patterns only\n`);
	}
	return words;
}

function loadConfig() {
	const config = JSON.parse(readFileSync(join(root, CONFIG_FILE), 'utf8'));
	const rules = config.rules.map((rule) => ({
		...rule,
		allow: rule.allow.map((entry) => entry.toLowerCase()),
		regexes: rule.patterns.map((pattern) => new RegExp(pattern, rule.flags ?? 'g')),
	}));
	return { ...config, rules };
}

function listFiles(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return listFiles(path);
		return entry.isFile() ? [toPosix(relative(root, path))] : [];
	});
}

function listTrackedFiles() {
	const output = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' });
	return output.split('\0').filter((path) => path !== '' && existsSync(join(root, path)) && statSync(join(root, path)).isFile());
}

// Binary-looking files (a NUL early on) skip the general patterns, but are
// still checked for sensitive words as UTF-8 and UTF-16 text.
function readFile(path) {
	const buffer = readFileSync(join(root, path));
	const isBinary = buffer.subarray(0, BINARY_SNIFF_BYTES).includes(0);
	const utf8 = buffer.toString('utf8');
	return { isBinary, views: isBinary ? [utf8, buffer.toString('utf16le')] : [utf8] };
}

// Tags and entities can split or encode a string in built HTML, so HTML is
// also checked entity-decoded (attributes included) and with tags removed or
// replaced by a space (a tag between two words of a phrase).
function htmlViews(html) {
	const TAG = /<[^>]*>/g;
	return [html, html.replace(TAG, ''), html.replace(TAG, ' ')].map(decodeEntities);
}

function decodeEntities(text) {
	return text
		.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
		.replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
		.replace(/&([a-z]+);/gi, (entity, name) => HTML_ENTITIES[name.toLowerCase()] ?? entity)
		.replace(/%2f/gi, '/')
		.replace(/%40/g, '@');
}

function matchesRule(rule, text) {
	return rule.regexes.some((regex) =>
		[...text.matchAll(regex)].some((match) => !rule.allow.includes(match[0].toLowerCase())),
	);
}

function checkFile(path, { generalRules, words, sensitiveWordRule }) {
	const { isBinary, views } = readFile(path);
	const isHtml = path.endsWith('.html');
	const texts = isHtml ? [...views, ...htmlViews(views[0])] : views;
	const hits = isBinary
		? []
		: generalRules
				.filter((rule) => (isHtml || !rule.htmlOnly) && texts.some((text) => matchesRule(rule, text)))
				.map((rule) => rule.id);
	const pathHasWord = words.some((matches) => matches(normalize(path)));
	if (pathHasWord || texts.some((text) => words.some((matches) => matches(normalize(text))))) {
		hits.push(sensitiveWordRule);
	}
	const shownPath = pathHasWord && isCi ? withheldPath(path) : path;
	return hits.map((rule) => `${shownPath} ${rule}`);
}

// In CI (public log) a path containing a sensitive word becomes a numbered
// token. The number is a per-run counter, not derived from the path, so it
// cannot be reversed by guessing words. Locally the real path is shown.
function withheldPath(path) {
	if (!withheldIds.has(path)) withheldIds.set(path, withheldIds.size + 1);
	return `${WITHHELD_PREFIX}${withheldIds.get(path)}`;
}

function ruleLegend(config) {
	const names = [...config.rules.map((rule) => `${rule.id} ${rule.name}`), `${config.sensitiveWordRule} ${SENSITIVE_WORD_NAME}`];
	return `rules: ${names.join(', ')}`;
}

function run() {
	const config = loadConfig();
	const words = loadWords();
	if (!existsSync(join(root, config.distDir))) throw new GuardExit(`${config.distDir}/ not found; run "pnpm run build" first`, 2);

	const distFiles = listFiles(join(root, config.distDir)).filter(
		(path) => !config.distExclude.some((prefix) => path.startsWith(prefix)),
	);
	const isSourceRoot = (path) => config.sourceRoots.some((prefix) => path.startsWith(prefix));
	const checks = [
		...distFiles.map((path) => [path, config.rules]),
		...listTrackedFiles().map((path) => [path, isSourceRoot(path) ? config.rules : []]),
	];

	const findings = new Set(
		checks.flatMap(([path, generalRules]) =>
			checkFile(path, { generalRules, words, sensitiveWordRule: config.sensitiveWordRule }),
		),
	);
	if (findings.size > 0) {
		process.stdout.write([...findings].sort().join('\n') + '\n');
		throw new GuardExit(`${findings.size} finding(s) above as "<path> <rule>"; ${ruleLegend(config)}`, 1);
	}
	process.stderr.write(`guard: passed (${checks.length} files checked)\n`);
}

// Errors print only their name/code: messages may quote file content.
try {
	run();
} catch (error) {
	if (error instanceof GuardExit) {
		process.stderr.write(`guard: ${error.message}\n`);
		process.exit(error.exitCode);
	}
	process.stderr.write(`guard: error: could not complete the check (${error.code ?? error.name}); see ${CONFIG_FILE} and git status\n`);
	process.exit(2);
}
