// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Plus Jakarta Sans',
			weights: ['500', '600', '700', '800'],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext'],
			cssVariable: '--font-display',
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Inter',
			weights: ['400', '500', '600'],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext'],
			cssVariable: '--font-body',
		},
		{
			provider: fontProviders.fontsource(),
			name: 'IBM Plex Mono',
			weights: ['500', '600'],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext'],
			cssVariable: '--font-mono',
		},
	],
});
