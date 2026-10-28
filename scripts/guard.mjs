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

const root = process.cwd();
const isCi = process.env.GITHUB_ACTIONS === 'true';

const toPosix = (path) => path.split(sep).join('/');
const normalize = (text) => text.normalize('NFC').toLowerCase();

function fail(message, code) {
	process.stderr.write(`guard: ${message}\n`);
	process.exit(code);
}

function parseWords(text) {
	return text
		.split('\n')
		.map((line) => line.replace(/\r$/, '').trim())
		.filter((line) => line !== '' && !line.startsWith('#'))
		.map(normalize);
}

// CI reads only the secret env so a developer's local file can never mask a
// missing secret (fail-closed). Locally the env wins when set, for tests.
function loadWords() {
	const fromEnv = process.env[WORDS_ENV] ?? '';
	if (isCi) {
		const words = parseWords(fromEnv);
		if (words.length === 0) fail(`${WORDS_ENV} is missing or has no words (fail-closed in CI)`, 1);
		return words;
	}
	if (fromEnv.trim() !== '') return parseWords(fromEnv);
	const localPath = join(root, LOCAL_WORDS_FILE);
	const words = existsSync(localPath) ? parseWords(readFileSync(localPath, 'utf8')) : [];
	if (words.length === 0) {
		process.stderr.write(`guard: warning: no sensitive words loaded (${LOCAL_WORDS_FILE}); checking general patterns only\n`);
	}
	return words;
}

function loadConfig() {
	const config = JSON.parse(readFileSync(join(root, CONFIG_FILE), 'utf8'));
	const rules = config.rules.map((rule) => ({
		...rule,
		regexes: rule.patterns.map((pattern) => new RegExp(pattern, 'g')),
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

function readText(path) {
	const buffer = readFileSync(join(root, path));
	return buffer.subarray(0, BINARY_SNIFF_BYTES).includes(0) ? null : buffer.toString('utf8');
}

function matchesRule(rule, text) {
	return rule.regexes.some((regex) =>
		[...text.matchAll(regex)].some((match) => !rule.allow.includes(match[0].toLowerCase())),
	);
}

function checkFile(path, { generalRules, words, sensitiveWordRule }) {
	const text = readText(path);
	if (text === null) return [];
	const isHtml = path.endsWith('.html');
	const hits = generalRules.filter((rule) => (isHtml || !rule.htmlOnly) && matchesRule(rule, text)).map((rule) => rule.id);
	if (words.length > 0) {
		const normalized = normalize(text);
		if (words.some((word) => normalized.includes(word))) hits.push(sensitiveWordRule);
	}
	return hits.map((rule) => `${path} ${rule}`);
}

function main() {
	const config = loadConfig();
	const words = loadWords();
	if (!existsSync(join(root, config.distDir))) fail(`${config.distDir}/ not found; run "npm run build" first`, 2);

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
		fail(`${findings.size} finding(s); see "<path> <rule>" lines above and rules in ${CONFIG_FILE}`, 1);
	}
	process.stderr.write(`guard: passed (${checks.length} files checked)\n`);
}

main();
