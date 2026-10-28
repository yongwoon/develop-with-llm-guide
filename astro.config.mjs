// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://yongwoon.github.io',
	base: '/develop-with-llm-guide',
	integrations: [
		starlight({
			title: 'develop-with-llm guide',
			locales: {
				root: { label: '한국어', lang: 'ko' },
			},
			sidebar: [
				{
					label: '시작하기',
					items: [{ label: '홈', slug: 'index' }],
				},
				{
					label: '상황별 흐름',
					items: [{ autogenerate: { directory: 'flows' } }],
				},
				{
					label: 'Skill reference',
					items: [{ autogenerate: { directory: 'skills' } }],
				},
				{
					label: 'Agents',
					items: [{ autogenerate: { directory: 'agents' } }],
				},
			],
		}),
	],
});
