import { defineStore } from 'pinia';
import type { IAppSettings } from '@/models/types/cardTypes';

export const useSettingsStore = defineStore(
	'settingsStore',
	() => {
		const settingsObject = reactive<IAppSettings>({
			isSaveLastStatisticsSet: true,
			MoneyMonthStartDate: 10,
		});

		return {
			settingsObject,
		};
	},
	{
		persist: true,
	}
);
