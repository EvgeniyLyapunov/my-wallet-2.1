import type { IOperation } from '@/models/types/cardTypes';
import { defineStore } from 'pinia';

export const useOperationsStore = defineStore(
	'operationsStore',
	() => {
		const operationsList = ref<IOperation[]>([]);

		return {
			operationsList,
		};
	},
	{
		persist: true,
	}
);
