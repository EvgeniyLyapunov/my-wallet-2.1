import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite';

export default defineConfig({
	plugins: [
		VueRouter({
			importMode: 'sync',
			dts: './src/typed-router.d.ts',
			routesFolder: 'src/pages/views',
		}),
		vue(),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
});
