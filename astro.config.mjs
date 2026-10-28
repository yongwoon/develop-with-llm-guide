// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

// https://astro.build/config
export default defineConfig({
	site: 'https://yongwoon.github.io',
	base: '/develop-with-llm-guide',
	integrations: [
		starlight({
			title: 'develop-with-llm guide',
			plugins: [starlightLinksValidator()],
			customCss: ['./src/styles/theme.css'],
			// Pretendard ships as unicode-range subsets; the browser fetches only
			// the subsets a page uses. Subset 91 holds Latin and common Hangul.
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'preload',
						href: '/develop-with-llm-guide/fonts/pretendard/woff2-dynamic-subset/PretendardVariable.subset.91.woff2',
						as: 'font',
						type: 'font/woff2',
						crossorigin: '',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: '/develop-with-llm-guide/fonts/pretendard/pretendardvariable-dynamic-subset.css',
					},
				},
			],
			// Code blocks are navy in both themes, so one dark syntax theme fits.
			expressiveCode: {
				themes: ['github-dark'],
				styleOverrides: {
					codeBackground: 'var(--code-bg)',
					codeForeground: 'var(--code-fg)',
					borderColor: 'var(--shadow)',
					borderRadius: '6px',
					frames: {
						editorBackground: 'var(--code-bg)',
						terminalBackground: 'var(--code-bg)',
						editorTabBarBackground: 'var(--code-bg)',
						terminalTitlebarBackground: 'var(--code-bg)',
						frameBoxShadowCssValue: '3px 3px 0 var(--shadow)',
					},
				},
			},
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
