import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	ssr: {
		noExternal: ['@photo-sphere-viewer/core', '@photo-sphere-viewer/gallery-plugin', '@photo-sphere-viewer/virtual-tour-plugin']
	}
});
