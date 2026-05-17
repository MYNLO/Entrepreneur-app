import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['browser-image-compression', 'pocketbase', 'dompurify']
	},
	server: {
		host: true,
		port: 5173
	}
});