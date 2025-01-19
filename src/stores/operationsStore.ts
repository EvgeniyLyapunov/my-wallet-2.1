import type { IOperation, IStatisticOptions } from '@/models/types/cardTypes';
import { defineStore } from 'pinia';
import { useWalletStore } from './walletStore';
import moment from 'moment-timezone';

export const useOperationsStore = defineStore(
	'operationsStore',
	() => {
		const { getCardId_ByName } = useWalletStore();
		const operationsList = ref<IOperation[]>([]);

		const addOperationToList = (operation: IOperation) => {
			operationsList.value = [...operationsList.value, operation];
		};

		const get_OperationsByStatisticOptions = (optionsObj: IStatisticOptions): IOperation[] => {
			const from = moment.tz(optionsObj.from, 'Europe/Moscow').startOf('minute');
			const to = moment.tz('Europe/Moscow');
			let resultList: IOperation[];
			resultList = operationsList.value.filter((item, i) => {
				const operationDate = moment.tz(item.date, 'Europe/Moscow');
				if (!operationDate.isBefore(from) && !operationDate.isAfter(to)) {
					return true;
				}
			});

			if (optionsObj.card) {
				resultList = resultList.filter((item) => {
					const cardId = getCardId_ByName(optionsObj.card!);
					if (item.cardId === cardId) {
						return true;
					}
				});
			}

			if (optionsObj.operationType) {
				resultList = resultList.filter((item) => item.type === optionsObj.operationType);
			}

			if (optionsObj.moneyType) {
				resultList = resultList.filter((item) => item.moneyType === optionsObj.moneyType);
			}

			if (optionsObj.tags.length > 0) {
				resultList = resultList.filter((item) => {
					if (item.tags.length === 0) return false;
					const arr = item.tags.filter((t) => {
						if (optionsObj.tags.some((teg) => teg.Id === t)) return true;
					});
					if (arr && arr.length > 0) return true;
				});
			}
			return resultList;
		};

		const cleanOperationsDeletedCard = (id: string) => {
			const list = operationsList.value.filter((item) => item.cardId !== id);
			operationsList.value = [...list];
		};

		return {
			operationsList,
			addOperationToList,
			get_OperationsByStatisticOptions,
			cleanOperationsDeletedCard,
		};
	},
	{
		persist: true,
	}
);
