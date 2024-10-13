import type { IOperation } from '@/models/types/cardTypes';
import { defineStore } from 'pinia';
import { useTagsStore } from '@/stores/tagsStore';

export const useOperationsStore = defineStore(
	'operationsStore',
	() => {
		const tagsStore = useTagsStore();
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
