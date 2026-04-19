// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
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
