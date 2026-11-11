// Markdown version of every docs page, at the page URL with the trailing slash
// replaced by `.md` (`/skills/ywc-plan/` -> `/skills/ywc-plan.md`, a directory
// index -> `/skills/index.md`). Listed in /llms.txt.
import type { APIRoute, GetStaticPaths } from 'astro';
import { listPublishedDocs, mdSlug, toMarkdown } from '../lib/llm-markdown';

export const getStaticPaths = (async () => {
	const docs = await listPublishedDocs();
	return docs.flatMap((entry) => {
		const slug = mdSlug(entry);
		return slug ? [{ params: { slug }, props: { markdown: toMarkdown(entry, docs) } }] : [];
	});
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
	new Response(props.markdown, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
