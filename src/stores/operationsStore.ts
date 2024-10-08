import type { IOperation } from '@/models/types/cardTypes';
import { defineStore } from 'pinia';

export const useOperationsStore = defineStore(
	'operationsStore',
	() => {
		const operationsList = ref<IOperation[]>([]);

		const addOperationToList = (operation: IOperation) => {
			operationsList.value = [...operationsList.value, operation];
		};

		return {
			operationsList,
			addOperationToList,
		};
	},
	{
		persist: true,
	}
);
