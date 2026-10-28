import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Frontmatter contract (spec 03-data). `kind` selects the required fields per
// page type; Starlight's `extend` merges each union member with its defaults.

export const TOOLS = ['claude-code', 'codex'] as const;
export const CATEGORIES = ['plan', 'implement', 'review', 'test', 'git', 'infra', 'docs', 'meta'] as const;
export const AGENT_GROUPS = ['overview', 'worker', 'advisor'] as const;

export const CATEGORY_LABELS: Record<Category, string> = {
	plan: '기획·사양',
	implement: '구현·실행',
	review: '리뷰·품질',
	test: '테스트·검증',
	git: 'Git·PR·릴리스',
	infra: '인프라',
	docs: '문서·프로젝트',
	meta: '세션·메타',
};

const tool = z.enum(TOOLS);
const tools = z.array(tool).min(1);
const nonEmpty = z.string().min(1);

// Per-tool values keyed like `tools`. Strict so a misspelled key fails the
// build instead of being dropped silently.
const perTool = <T extends z.ZodType>(value: T) =>
	z
		.strictObject({ 'claude-code': value.optional(), codex: value.optional() })
		.refine((entry) => Object.keys(entry).length > 0, 'at least one tool key is required');

// YAML reads an unquoted 2026-10-28 as a Date, so both forms normalize to the
// YYYY-MM-DD string.
const verifiedAt = z.preprocess(
	(value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
	z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'verifiedAt must be YYYY-MM-DD'),
);
const sourceVersion = perTool(nonEmpty);

const optionSchema = z.strictObject({
	name: nonEmpty,
	format: nonEmpty,
	default: nonEmpty.optional(),
	when: nonEmpty,
	tools,
	note: nonEmpty.optional(),
});

const titleBlockSchema = z
	.strictObject({
		number: z.number().int().min(10).max(25),
		steps: z.number().int().min(1),
		required: z.number().int().min(0),
		optional: z.number().int().min(0),
		outputs: z.array(nonEmpty).min(1),
	})
	.refine((block) => block.required + block.optional === block.steps, {
		message: 'titleBlock.required + titleBlock.optional must equal titleBlock.steps',
		path: ['steps'],
	});

const verified = { verifiedAt, sourceVersion };

const kindSchema = z.discriminatedUnion('kind', [
	z.object({ kind: z.literal('guide'), ...verified }),
	z.object({ kind: z.literal('index'), verifiedAt: verifiedAt.optional(), sourceVersion: sourceVersion.optional() }),
	z.object({ kind: z.literal('flow'), ...verified, titleBlock: titleBlockSchema }),
	z.object({
		kind: z.literal('skill'),
		...verified,
		category: z.enum(CATEGORIES),
		tools,
		summary: nonEmpty,
		options: z.array(optionSchema),
		outputs: z.array(nonEmpty).optional(),
		next: z.array(nonEmpty).optional(),
		userInvoked: perTool(z.boolean()).optional(),
		argsNote: nonEmpty.optional(),
		excludedOptions: perTool(z.array(nonEmpty)).optional(),
	}),
	z.object({ kind: z.literal('agent'), ...verified, agentGroup: z.enum(AGENT_GROUPS) }),
]);

export type Tool = (typeof TOOLS)[number];
export type Category = (typeof CATEGORIES)[number];
export type AgentGroup = (typeof AGENT_GROUPS)[number];
export type SkillOption = z.infer<typeof optionSchema>;
export type TitleBlock = z.infer<typeof titleBlockSchema>;
export type KindFrontmatter = z.infer<typeof kindSchema>;
export type SkillFrontmatter = Extract<KindFrontmatter, { kind: 'skill' }>;
export type FlowFrontmatter = Extract<KindFrontmatter, { kind: 'flow' }>;

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema({ extend: kindSchema }) }),
};
