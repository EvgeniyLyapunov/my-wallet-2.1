import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import VueApexCharts from 'vue3-apexcharts';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

import '@/style/base.scss';

const vuetify = createVuetify({
	components,
	directives,
	icons: {
		defaultSet: 'mdi',
	},
});

import App from './App.vue';
import router from './router';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(VueApexCharts);

import { useSettingsStore } from './stores/settingsStore';
import type { IAppSettings } from '@/models/types/cardTypes';

async function loadAppSettings() {
	const response = await fetch('/appsettings.json');
	if (!response.ok) {
		throw new Error('Не удалось загрузить настройки приложения');
	}
	const settings: IAppSettings = await response.json();
	return settings;
}

const { setSettingsParameters } = useSettingsStore();

loadAppSettings()
	.then((settings) => {
		setSettingsParameters(settings);
	})
	.then(() => {
		app.mount('#app');
	})
	.catch((error) => {
		console.error('Ошибка при загрузке настроек:', error);
	});
