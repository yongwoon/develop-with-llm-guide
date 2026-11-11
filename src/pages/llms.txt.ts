// /llms.txt: index of the Markdown version of every page, in sidebar order,
// with a reading order for an LLM that follows the guide step by step.
import type { APIRoute } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { listPublishedDocs, mdPath, mdSlug } from '../lib/llm-markdown';

type Page = { slug: string; entry: CollectionEntry<'docs'> };

// Mirrors the sidebar groups in astro.config.mjs. A page outside these
// directories fails the build instead of going missing from the index.
const GROUPS: { label: string; has: (slug: string) => boolean }[] = [
	{ label: '시작하기', has: (slug) => slug === 'index' || slug.startsWith('getting-started/') },
	{ label: '사용 안내', has: (slug) => slug.startsWith('guides/') },
	{ label: '상황별 흐름', has: (slug) => slug.startsWith('flows/') },
	{ label: 'Skill reference', has: (slug) => slug.startsWith('skills/') },
	{ label: 'Agents', has: (slug) => slug.startsWith('agents/') },
];
// 시작하기 lists its items explicitly in the sidebar; the rest sort by sidebar.order.
const START_ORDER = ['index', 'getting-started/install', 'getting-started/tool-differences'];

function rank({ slug, entry }: Page): number {
	const start = START_ORDER.indexOf(slug);
	return start >= 0 ? start : (entry.data.sidebar.order ?? Number.MAX_SAFE_INTEGER);
}

export const GET: APIRoute = async ({ site }) => {
	const docs = await listPublishedDocs();
	const pages = docs.flatMap((entry) => {
		const slug = mdSlug(entry);
		return slug ? [{ slug, entry }] : [];
	});
	const orphans = pages.filter(({ slug }) => !GROUPS.some((group) => group.has(slug)));
	if (orphans.length > 0) {
		throw new Error(`llms.txt: no group for ${orphans.map(({ slug }) => slug).join(', ')}; add it to GROUPS`);
	}
	const url = (slug: string) => new URL(mdPath(slug), site).href;
	const item = ({ slug, entry }: Page) =>
		`- [${entry.data.title}](${url(slug)})${entry.data.description ? `: ${entry.data.description}` : ''}`;
	const sections = GROUPS.map(({ label, has }) => {
		const items = pages.filter(({ slug }) => has(slug)).sort((a, b) => rank(a) - rank(b) || a.slug.localeCompare(b.slug, 'en'));
		return `## ${label}\n\n${items.map(item).join('\n')}`;
	});

	const body = `# ywc skills

> ywc-* skill 과 agent 의 사용법을 다루는 한국어 guidebook 입니다. 아래 link 는 모두 각 page 의 Markdown 판이며, HTML page 의 URL 끝 \`/\` 를 \`.md\` 로 바꾼 주소입니다 (directory 는 \`index.md\`).

**읽는 순서**

1. [설치](${url('getting-started/install')}) 로 skill 과 agent 를 설치합니다.
2. [설정](${url('guides/configuration')}) 으로 언어 등 기본값을 정합니다.
3. "상황별 흐름" 에서 지금 상황에 맞는 page 하나를 고릅니다. 각 흐름은 skill 을 실행 순서대로 번호를 붙여 나열합니다.
4. 흐름에 나온 skill 의 option 은 "Skill reference" 의 해당 page 에서 확인합니다. 어느 skill 인지 모르면 [Skill 색인](${url('skills/index')}) 을 봅니다.

${sections.join('\n\n')}
`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
