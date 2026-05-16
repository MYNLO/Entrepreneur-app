import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		csrf: {
			// Production origins only - no localhost
			trustedOrigins: [
				'http://92.242.61.170:8000',
				'http://92.242.61.170',
				'https://92.242.61.170'
			]
		}
	}
};

export default config;