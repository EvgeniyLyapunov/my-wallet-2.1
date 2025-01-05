import { defineStore } from 'pinia';
import type { IAppSettings } from '@/models/types/cardTypes';

export const useSettingsStore = defineStore('settingsStore', () => {
	const settingsObject = reactive<IAppSettings>({
		isSaveLastStatisticOptions: true,
		salaryMonthStart: 10,
	});

	const setSettingsParameters = (obj: IAppSettings) => {
		settingsObject.salaryMonthStart = Number(obj.salaryMonthStart);
		settingsObject.isSaveLastStatisticOptions = obj.isSaveLastStatisticOptions;
	};

	return {
		settingsObject,
		setSettingsParameters,
	};
});
