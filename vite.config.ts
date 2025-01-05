import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
	plugins: [
		Components({
			dts: './src/components.d.ts',
			types: [],
		}),
		AutoImport({
			imports: [
				'vue',
				'pinia',
				VueRouterAutoImports,
				{
					vuetify: ['useTheme', 'useRtl', 'useLocale', 'useDisplay', 'useLayout'],
				},
			],
			dts: 'src/auto-imports.d.ts',
			dirs: ['src/stores'],
		}),
		VueRouter({
			importMode: 'sync',
			dts: './typed-router.d.ts',
			routesFolder: 'src/pages/views',
		}),
		vue(),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 5108,
		open: true,
	},
});
