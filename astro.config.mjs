// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import swup from "@swup/astro";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	integrations: [
		sitemap(),
		swup({
			theme: false,
			animationClass: false,
			globalInstance: true,
			preload: {
				hover: true,
				visible: true,
			},
			reloadScripts: false,
			updateHead: {
				awaitAssets: true,
				persistAssets: true,
			},
		}),
	],
	site: "https://lintasnusa.lincie.me",
	server: {
		host: true,
		port: 4321,
	},
	vite: {
		plugins: [tailwindcss()],
		server: {
			strictPort: true,
			// Keep the HMR client on the same visible port when dev traffic is forwarded/proxied.
			hmr: {
				clientPort: 4321,
			},
		},
	},
});
