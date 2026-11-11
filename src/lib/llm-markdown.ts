// Plain-Markdown rendering of a docs page for LLM and bot readers. Pages are
// MDX whose tables and cards come from frontmatter through Astro components,
// so the raw source is not readable on its own: each component is rewritten
// here to the Markdown it stands for. A page that still contains one of its
// imported components afterwards fails the build, which is how a newly added
// component gets noticed.
import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORY_LABELS, TOOLS, type SkillFrontmatter } from '../content.config';

type Doc = CollectionEntry<'docs'>;
type Skill = SkillFrontmatter & { name: string };

// Tool display labels; keep in sync with SkillCard, OptionTable, SkillIndex, VerifiedStamp.
const TOOL_LABELS = { 'claude-code': 'Claude Code', codex: 'Codex' } as const;
const SUPPORTED = '지원';
const UNSUPPORTED = '미지원';
const EMPTY = '—';
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const FENCE = /(^```[\s\S]*?^```[^\n]*$)/m;

/**
 * Pages that get a Markdown version. Starlight builds no HTML route for a
 * draft in production, so a draft must not be published here either.
 */
export const listPublishedDocs = () => getCollection('docs', ({ data }) => !data.draft);

/** Path under the site base without extension, e.g. `skills/index`, `skills/ywc-plan`. */
export function mdSlug(entry: Doc): string | undefined {
	return entry.filePath?.match(/content\/docs\/(.+)\.mdx?$/)?.[1];
}

/** Site-absolute path of a page's Markdown version. */
export const mdPath = (slug: string) => `${BASE}/${slug}.md`;

const skillLink = (name: string) => `[${name}](${mdPath(`skills/${name}`)})`;
const cell = (text: string) => text.replaceAll('|', '\\|').replace(/\s*\n\s*/g, ' ');
const table = (head: string[], rows: string[][]) =>
	[head, head.map(() => '---'), ...rows].map((row) => `| ${row.join(' | ')} |`).join('\n');

function listSkills(docs: Doc[]): Skill[] {
	return docs
		.flatMap(({ id, data }) => (data.kind === 'skill' ? [{ ...data, name: id.split('/').pop() ?? id }] : []))
		.sort((a, b) => a.name.localeCompare(b.name, 'en'));
}

function skillCard(data: SkillFrontmatter): string {
	const userInvoked = data.tools
		.filter((tool) => data.userInvoked?.[tool] === true)
		.map((tool) => (tool === 'codex' ? `${TOOL_LABELS[tool]} (권고)` : TOOL_LABELS[tool]));
	return [
		`- 분류: ${CATEGORY_LABELS[data.category]}`,
		`- 사용 가능 도구: ${data.tools.map((tool) => TOOL_LABELS[tool]).join(' · ')}`,
		userInvoked.length > 0 && `- 직접 호출 전용: ${userInvoked.join(' · ')}`,
		data.outputs?.length && `- 산출물: ${data.outputs.map((output) => `\`${output}\``).join(', ')}`,
		data.next?.length && `- 다음 skill: ${data.next.map(skillLink).join(', ')}`,
	]
		.filter(Boolean)
		.join('\n');
}

function optionTable(data: SkillFrontmatter): string {
	const rows = data.options.map((option) => [
		`\`${cell(option.name)}\``,
		`\`${cell(option.format)}\``,
		cell(option.default ?? EMPTY),
		cell(option.note ? `${option.when} (${option.note})` : option.when),
		...TOOLS.map((tool) => (option.tools.includes(tool) ? SUPPORTED : UNSUPPORTED)),
	]);
	const body =
		rows.length === 0
			? 'option 없음'
			: table(['option', '형식', '기본값', '언제 쓰나', ...TOOLS.map((tool) => TOOL_LABELS[tool])], rows);
	return data.argsNote ? `${body}\n\n${data.argsNote}` : body;
}

function skillIndex(skills: Skill[]): string {
	return table(
		['skill', '분류', '도구', '한 줄 용도', 'option 수'],
		skills.map((skill) => [
			skillLink(skill.name),
			CATEGORY_LABELS[skill.category],
			skill.tools.map((tool) => TOOL_LABELS[tool]).join(' · '),
			cell(skill.summary),
			String(skill.options.length),
		]),
	);
}

function optionUsers(name: string, skills: Skill[]): string {
	const users = skills.filter((skill) => skill.options.some((option) => option.name === name));
	return `쓰는 skill (${users.length}): ${users.map((skill) => skillLink(skill.name)).join(', ')}`;
}

// Same selection rule as OutputsMap.astro: only outputs that look like a path.
function outputsMap(skills: Skill[]): string {
	const PATH = /^(?:[\w.<>-]+\/)*(?:[\w<>.-]*\.\w+|[\w.<>-]+\/|Dockerfile)$/;
	const byPath = new Map<string, string[]>();
	for (const skill of skills) {
		for (const output of (skill.outputs ?? []).flatMap((entry) => entry.split(' 또는 '))) {
			const [path, ...rest] = output.split(' ');
			const note = rest.join(' ');
			if (!PATH.test(path) || note.startsWith('에 ')) continue;
			byPath.set(path, [...(byPath.get(path) ?? []), skillLink(skill.name) + (note ? ` (${cell(note)})` : '')]);
		}
	}
	const rows = [...byPath.entries()].sort(([a], [b]) => a.localeCompare(b, 'en'));
	return table(
		['file·directory', '만드는 skill'],
		rows.map(([path, makers]) => [`\`${cell(path)}\``, makers.join(', ')]),
	);
}

// <FlowStep skill="a" kind="alt" alt={['b']} tools={['codex']} desc="…" optional />
function flowSteps(inner: string): string {
	return [...inner.matchAll(/<FlowStep\s+([\s\S]*?)\/>/g)]
		.map(([, attrs], index) => {
			const text = (name: string) => attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
			const list = (name: string) =>
				[...(attrs.match(new RegExp(`\\b${name}=\\{\\[([^\\]]*)\\]\\}`))?.[1] ?? '').matchAll(/'([^']+)'/g)].map(
					(match) => match[1],
				);
			const names = [text('skill') ?? '', ...list('alt')].map(skillLink).join(' 또는 ');
			const tools = list('tools') as (keyof typeof TOOL_LABELS)[];
			// Quoted values are dropped first so a desc containing "optional" is not a flag.
			const isOptional = /\boptional\b/.test(attrs.replace(/"[^"]*"/g, ''));
			const badges = [
				isOptional ? '선택' : '필수',
				text('kind') === 'loop' && '↔ 반복',
				tools.length > 0 && `${tools.map((tool) => TOOL_LABELS[tool]).join(' · ')} 전용`,
			].filter(Boolean);
			return `${index + 1}. ${names} (${badges.join(', ')}) — ${text('desc') ?? ''}`;
		})
		.join('\n');
}

// Internal links are written as `/<base>/flows/x/`; point them at the Markdown version.
function linkToMarkdown(text: string, slugs: Set<string>): string {
	return text.replace(new RegExp(`\\]\\(${BASE}/([^)#\\s]*)(#[^)\\s]*)?\\)`, 'g'), (link, path: string, hash = '') => {
		const page = path.replace(/\/$/, '');
		const slug = [page, page === '' ? 'index' : `${page}/index`].find((candidate) => slugs.has(candidate));
		return slug ? `](${mdPath(slug)}${hash})` : link;
	});
}

function header(entry: Doc): string {
	const { data } = entry;
	const lines = [`# ${data.title}`];
	if (data.description) lines.push(`> ${data.description}`);
	if (data.kind === 'flow') {
		const { number, steps, required, optional, outputs } = data.titleBlock;
		lines.push(`흐름 ${number} · 단계 ${steps} (필수 ${required} / 선택 ${optional}) · 산출물: ${outputs.join(', ')}`);
	}
	return lines.join('\n\n');
}

function stamp(data: Doc['data']): string {
	if (!data.verifiedAt) return '';
	const versions = Object.entries(data.sourceVersion ?? {}) as [keyof typeof TOOL_LABELS, string][];
	return [`확인일 ${data.verifiedAt}`, ...versions.map(([tool, version]) => `${TOOL_LABELS[tool]} ${version}`)].join(' · ');
}

export function toMarkdown(entry: Doc, docs: Doc[]): string {
	const { data } = entry;
	const skills = listSkills(docs);
	const slugs = new Set(docs.flatMap((doc) => mdSlug(doc) ?? []));
	const source = entry.body ?? '';
	// The leading import block, including blank lines between imports and
	// imports that span several lines.
	const imports = source.match(/^(?:\s*import\s[^;]*?from\s+['"][^'"]+['"];?[ \t]*\n)+/)?.[0] ?? '';
	const imported = [...imports.matchAll(/import\s+\{?([^}'"]+?)\}?\s+from/g)].flatMap(([, names]) =>
		names.split(',').map((name) => name.trim()),
	);
	const skill = (component: string) => {
		if (data.kind !== 'skill') throw new Error(`llm-markdown: <${component} /> on non-skill page ${entry.id}`);
		return data;
	};

	// Odd segments are fenced code blocks and pass through untouched.
	const segments = source.slice(imports.length).split(new RegExp(FENCE, 'gm'));
	const prose = (text: string) =>
		linkToMarkdown(text, slugs)
			.replace(/<Flow>([\s\S]*?)<\/Flow>/g, (_, inner: string) => flowSteps(inner))
			.replace(/<SkillLink name="([^"]+)" \/>/g, (_, name: string) => skillLink(name))
			.replace(/<OptionUsers name="([^"]+)" \/>/g, (_, name: string) => optionUsers(name, skills))
			.replace(/^<SkillCard \/>$/gm, () => skillCard(skill('SkillCard')))
			.replace(/^<OptionTable \/>$/gm, () => optionTable(skill('OptionTable')))
			.replace(/^<SkillIndex \/>$/gm, () => skillIndex(skills))
			.replace(/^<OutputsMap \/>$/gm, () => outputsMap(skills))
			.replace(/^<VerifiedStamp \/>$/gm, () => stamp(data))
			.replace(/^<TabItem label="([^"]+)">$/gm, '**$1**\n')
			.replace(/^<Aside(?:\s[^>]*?title="([^"]+)")?[^>]*>$/gm, (_, title?: string) => `**${title ?? '참고'}**\n`)
			.replace(/^<\/?(?:Tabs|TabItem|Aside)(?:\s[^>]*)?>\n?/gm, '\n')
			.replace(/\n{3,}/g, '\n\n');
	const converted = segments.map((segment, index) => (index % 2 === 1 ? segment : prose(segment)));

	const leftover = imported.filter((name) =>
		converted.some((segment, index) => index % 2 === 0 && new RegExp(`</?${name}\\b`).test(segment)),
	);
	if (leftover.length > 0) {
		throw new Error(`llm-markdown: ${entry.id} still contains <${leftover.join('>, <')}>; add a rule in src/lib/llm-markdown.ts`);
	}
	return `${header(entry)}\n\n${converted.join('').trim()}\n`;
}
