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
			components: {
				Search: './src/components/overrides/Search.astro',
				PageTitle: './src/components/overrides/PageTitle.astro',
				Sidebar: './src/components/overrides/Sidebar.astro',
				PageSidebar: './src/components/overrides/PageSidebar.astro',
			},
			// Pretendard ships as unicode-range subsets; the browser fetches only
			// the subsets a page uses. Subset 91 holds Latin and a few Hangul
			// syllables, so the preload helps UI text; other Hangul loads on demand.
			head: [
				// Restores the layout preferences saved by the Sidebar and PageSidebar
				// overrides before first paint, so the page does not jump on load.
				{
					tag: 'script',
					content:
						"try{var s=localStorage,r=document.documentElement;if(s.getItem('dwlg:sidebar')==='collapsed')r.dataset.sidebar='collapsed';var w=parseInt(s.getItem('dwlg:toc-width'),10);if(w>=192&&w<=448)r.style.setProperty('--toc-width',w+'px')}catch(e){}",
				},
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
					items: [
						{ label: '홈', slug: 'index' },
						{ label: '설치', slug: 'getting-started/install' },
						{ label: '두 도구의 차이', slug: 'getting-started/tool-differences' },
					],
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
