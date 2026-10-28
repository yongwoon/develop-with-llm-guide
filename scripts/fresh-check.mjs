#!/usr/bin/env node
// Freshness check (spec R-FRESH): compares the local develop-with-llm
// checkout with this site's frontmatter, per tool and in both directions.
// Reads only names, option keys, userInvoked flags and VERSION; prints the
// report to stdout and writes nothing. Exit 0 match / 1 differences / 2 the
// source cannot be read.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
// `yaml` is a direct dependency of astro; Node has no YAML parser.
import { parse as parseYaml } from 'yaml';

const SOURCE_ENV = 'FRESH_CHECK_SOURCE';
const DEFAULT_SOURCE = '../develop-with-llm';
const DOCS_DIR = 'src/content/docs';
const EXCLUDED_SKILLS = new Set(['ywc-shared-scripts']);
const SOURCE_TOOLS = {
	'claude-code': { root: 'tools/claude-code', agentExt: '.md' },
	codex: { root: 'tools/codex-skill', agentExt: '.toml' },
};
const TOOL_NAMES = Object.keys(SOURCE_TOOLS);
const DELEGATION_HINT = /caller-only|passed by|\balias\b/i;
const FLAG = /--[A-Za-z0-9][\w-]*/g;
const PLACEHOLDER = /<[^<>]+>/g;

class SourceError extends Error {}

// ---- Arguments table parser (R-FRESH option key normalization) ----

// Splits a Markdown table row on `|`, ignoring pipes inside backticks.
export function splitRow(line) {
	const cells = [];
	let cell = '';
	let inCode = false;
	for (let i = 0; i < line.length; i += 1) {
		const char = line[i];
		if (char === '\\' && line[i + 1] === '|') {
			cell += '|';
			i += 1;
		} else if (char === '`') {
			inCode = !inCode;
			cell += char;
		} else if (char === '|' && !inCode) {
			cells.push(cell.trim());
			cell = '';
		} else {
			cell += char;
		}
	}
	cells.push(cell.trim());
	return cells.slice(line.trimStart().startsWith('|') ? 1 : 0, line.trimEnd().endsWith('|') ? -1 : undefined);
}

const isSeparatorRow = (cells) => cells.length > 0 && cells.every((cell) => /^:?-+:?$/.test(cell));

// Keys of one first-column cell. A `--flag` inside backticks is a key (aliases
// too); a `<…>` next to a flag is its value, a `<…>` alone is positional.
export function cellKeys(cell) {
	const keys = [];
	for (const [, code] of cell.matchAll(/`([^`]*)`/g)) {
		const flags = code.match(FLAG) ?? [];
		if (flags.length > 0) keys.push(...flags);
		else keys.push(...(code.match(PLACEHOLDER) ?? []).map((token) => `positional:${token}`));
	}
	const outside = cell.replace(/`[^`]*`/g, ' ');
	keys.push(...(outside.match(PLACEHOLDER) ?? []).map((token) => `positional:${token}`));
	return keys;
}

// Returns { keys, naturalRows, hints } or { error }.
export function parseArguments(markdown) {
	const lines = markdown.split(/\r?\n/);
	const start = lines.findIndex((line) => /^##\s+Arguments\s*$/.test(line));
	if (start === -1) return { error: 'no "## Arguments" section' };
	const section = [];
	for (const line of lines.slice(start + 1)) {
		if (/^#{2,3}\s/.test(line)) break;
		section.push(line);
	}
	const firstText = section.find((line) => line.trim() !== '')?.trim() ?? '';
	if (/^N\/A\s*—/.test(firstText)) return { keys: new Set(), naturalRows: 0, hints: [] };

	const tableStart = section.findIndex((line) => line.trimStart().startsWith('|'));
	if (tableStart === -1) return { error: 'no table under "## Arguments"' };
	const table = [];
	for (const line of section.slice(tableStart)) {
		if (!line.trimStart().startsWith('|')) break;
		table.push(splitRow(line));
	}
	if (table.length < 2 || !isSeparatorRow(table[1])) return { error: 'Arguments table has no header separator' };

	const keys = new Set();
	const hints = [];
	let naturalRows = 0;
	for (const cells of table.slice(2)) {
		const rowKeys = cellKeys(cells[0] ?? '');
		if (rowKeys.length === 0) {
			naturalRows += 1;
			continue;
		}
		rowKeys.forEach((key) => keys.add(key));
		if (DELEGATION_HINT.test(cells.join(' '))) hints.push(...rowKeys);
	}
	return { keys, naturalRows, hints };
}

// Site option names: aliases are written `--a / --b`, placeholders `<PR#>`.
export function siteKeys(name) {
	return name.split('/').flatMap((part) => {
		const flag = part.match(FLAG);
		if (flag) return flag;
		return (part.match(PLACEHOLDER) ?? []).map((token) => `positional:${token}`);
	});
}

// ---- Source (develop-with-llm) ----

function readSourceFile(path) {
	try {
		return readFileSync(path, 'utf8');
	} catch (error) {
		throw new SourceError(`cannot read ${path} (${error.code ?? error.name})`);
	}
}

function listDir(path) {
	try {
		return readdirSync(path, { withFileTypes: true });
	} catch (error) {
		throw new SourceError(`cannot read ${path} (${error.code ?? error.name})`);
	}
}

const frontmatterOf = (text) => text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';

function readSourceTool(sourceRoot, tool) {
	const root = join(sourceRoot, SOURCE_TOOLS[tool].root);
	const version = readSourceFile(join(root, 'VERSION')).trim();
	const skills = new Map();
	for (const entry of listDir(join(root, 'skills'))) {
		const skillMd = join(root, 'skills', entry.name, 'SKILL.md');
		if (!entry.isDirectory() || !entry.name.startsWith('ywc-') || EXCLUDED_SKILLS.has(entry.name)) continue;
		if (!existsSync(skillMd)) continue;
		const text = readSourceFile(skillMd);
		skills.set(entry.name, { args: parseArguments(text), userInvoked: isUserInvoked(tool, text, join(root, 'skills', entry.name)) });
	}
	const agents = new Set(
		listDir(join(root, 'agents'))
			.filter((entry) => entry.isFile() && entry.name.startsWith('ywc-') && entry.name.endsWith(SOURCE_TOOLS[tool].agentExt))
			.map((entry) => entry.name.slice(0, -SOURCE_TOOLS[tool].agentExt.length)),
	);
	return { version, skills, agents };
}

// Claude Code: `disable-model-invocation: true` in SKILL.md frontmatter.
// Codex: `policy.allow_implicit_invocation: false` in agents/openai.yaml.
function isUserInvoked(tool, skillText, skillDir) {
	if (tool === 'claude-code') return parseYaml(frontmatterOf(skillText))?.['disable-model-invocation'] === true;
	const policyFile = join(skillDir, 'agents', 'openai.yaml');
	if (!existsSync(policyFile)) return false;
	return parseYaml(readSourceFile(policyFile))?.policy?.allow_implicit_invocation === false;
}

// ---- Site ----

function readSitePages(siteRoot) {
	const docs = join(siteRoot, DOCS_DIR);
	const pages = [];
	const walk = (dir) => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const path = join(dir, entry.name);
			if (entry.isDirectory()) walk(path);
			else if (/\.mdx?$/.test(entry.name)) {
				const text = readFileSync(path, 'utf8');
				pages.push({ path: path.slice(docs.length + 1), name: entry.name.replace(/\.mdx?$/, ''), text, data: parseYaml(frontmatterOf(text)) ?? {} });
			}
		}
	};
	walk(docs);
	return pages;
}

// Agent page tables: the first cell names the agent (`ywc-…`), the second
// lists the tools ("Claude Code", "Codex").
function siteAgents(pages) {
	const agents = new Map(TOOL_NAMES.map((tool) => [tool, new Set()]));
	for (const page of pages.filter((page) => page.data.kind === 'agent')) {
		for (const line of page.text.split(/\r?\n/).filter((line) => line.trimStart().startsWith('|'))) {
			const [first = '', second = ''] = splitRow(line);
			const name = first.match(/ywc-[a-z0-9-]+/)?.[0];
			if (!name) continue;
			if (/claude code/i.test(second)) agents.get('claude-code').add(name);
			if (/codex/i.test(second)) agents.get('codex').add(name);
		}
	}
	return agents;
}

// ---- Comparison ----

const difference = (a, b) => [...a].filter((item) => !b.has(item)).sort();

function compareSkill(name, source, page) {
	const issues = [];
	const sourceTools = TOOL_NAMES.filter((tool) => source[tool].skills.has(name));
	const data = page.data;
	const siteTools = data.tools ?? [];
	if (sourceTools.join() !== TOOL_NAMES.filter((tool) => siteTools.includes(tool)).join()) {
		issues.push(`tools: site [${siteTools.join(', ')}] / develop-with-llm [${sourceTools.join(', ')}]`);
	}
	for (const tool of sourceTools) {
		const { args, userInvoked } = source[tool].skills.get(name);
		if (args.error) {
			issues.push(`${tool} Arguments parse error: ${args.error}`);
			continue;
		}
		const site = new Set([
			...(data.options ?? []).filter((option) => option.tools?.includes(tool)).flatMap((option) => siteKeys(option.name)),
			...(data.excludedOptions?.[tool] ?? []).flatMap(siteKeys),
		]);
		const missing = difference(args.keys, site);
		const extra = difference(site, args.keys);
		if (missing.length > 0) issues.push(`${tool} option 누락: ${missing.join(', ')}`);
		if (extra.length > 0) issues.push(`${tool} option 초과: ${extra.join(', ')}`);
		const siteUserInvoked = data.userInvoked?.[tool] === true;
		if (siteUserInvoked !== userInvoked) issues.push(`${tool} userInvoked: site ${siteUserInvoked} / develop-with-llm ${userInvoked}`);
	}
	return issues;
}

function notes(name, source) {
	return TOOL_NAMES.flatMap((tool) => {
		const args = source[tool].skills.get(name)?.args;
		if (!args || args.error) return [];
		const lines = [];
		if (args.hints.length > 0) lines.push(`${name} ${tool} 위임 문구 후보 (excludedOptions 판정 필요): ${[...new Set(args.hints)].join(', ')}`);
		if (args.naturalRows > 0) lines.push(`${name} ${tool} 자연어 인자 행 ${args.naturalRows}개 (argsNote 로 설명)`);
		return lines;
	});
}

export function check(sourceRoot, siteRoot) {
	if (!existsSync(sourceRoot)) throw new SourceError(`develop-with-llm not found at ${sourceRoot} (set ${SOURCE_ENV})`);
	const source = Object.fromEntries(TOOL_NAMES.map((tool) => [tool, readSourceTool(sourceRoot, tool)]));
	const pages = readSitePages(siteRoot);
	const skillPages = new Map(pages.filter((page) => page.data.kind === 'skill').map((page) => [page.name, page]));
	const sourceSkills = new Set(TOOL_NAMES.flatMap((tool) => [...source[tool].skills.keys()]));

	const report = [];
	const info = [];
	for (const name of [...new Set([...sourceSkills, ...skillPages.keys()])].sort()) {
		const page = skillPages.get(name);
		if (!sourceSkills.has(name)) report.push(`${name}: develop-with-llm 에 없는 skill page`);
		else if (!page) report.push(`${name}: skill page 없음`);
		else report.push(...compareSkill(name, source, page).map((issue) => `${name}: ${issue}`));
		if (sourceSkills.has(name)) info.push(...notes(name, source));
	}

	const agentPages = pages.filter((page) => page.data.kind === 'agent');
	if (agentPages.length === 0) report.push('agents: agent page 없음');
	else {
		const site = siteAgents(pages);
		for (const tool of TOOL_NAMES) {
			const missing = difference(source[tool].agents, site.get(tool));
			const extra = difference(site.get(tool), source[tool].agents);
			if (missing.length > 0) report.push(`agents: ${tool} 누락: ${missing.join(', ')}`);
			if (extra.length > 0) report.push(`agents: ${tool} 초과: ${extra.join(', ')}`);
		}
	}

	for (const page of pages) {
		for (const [tool, version] of Object.entries(page.data.sourceVersion ?? {})) {
			const current = source[tool]?.version;
			if (current && String(version) !== current) report.push(`stale: ${page.path} ${tool} ${version} (현재 ${current})`);
		}
	}
	return { report, info };
}

function main() {
	const sourceRoot = process.env[SOURCE_ENV] || DEFAULT_SOURCE;
	try {
		const { report, info } = check(sourceRoot, process.cwd());
		if (info.length > 0) process.stdout.write(`참고\n${info.map((line) => `  ${line}`).join('\n')}\n\n`);
		if (report.length === 0) {
			process.stdout.write('fresh-check: 차이 없음\n');
			process.exit(0);
		}
		process.stdout.write(`${report.join('\n')}\n\nfresh-check: 차이 ${report.length}건\n`);
		process.exit(1);
	} catch (error) {
		const message = error instanceof SourceError ? error.message : `${error.code ?? error.name}: ${error.message}`;
		process.stderr.write(`fresh-check: ${message}\n`);
		process.exit(2);
	}
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
