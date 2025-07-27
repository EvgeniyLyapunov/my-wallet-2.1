import type { IOperation, IStatisticOptions, ITag } from '@/models/types/cardTypes';
import { defineStore } from 'pinia';
import { useWalletStore } from './walletStore';
import moment from 'moment-timezone';

export const useOperationsStore = defineStore(
	'operationsStore',
	() => {
		const { getCardId_ByName } = useWalletStore();
		const operationsList = ref<IOperation[]>([]);
		let currentSelectedTag: ITag | undefined = undefined;
		let isCurrentSelectedExclusionTag: boolean = false;

		const getOperationsList = () => {
			const list = [...operationsList.value];
			return list;
		};

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
					if (!item.tag) return false;
					if (optionsObj.tags.some((tag) => tag.Id === item.tag)) return true;
				});
			}
			return resultList;
		};

		const cleanOperationsDeletedCard = (id: string) => {
			const list = operationsList.value.filter((item) => item.cardId !== id);
			operationsList.value = [...list];
		};

		const delete_TodayOperations = () => {
			operationsList.value = operationsList.value.filter(
				(item) => moment(item.date).date() !== moment().date()
			);
		};

		const delete_AllOperations = () => {
			operationsList.value = [];
		};

		const get_operationsByPeriod = (start: Date) => {
			const from = moment.tz(start, 'Europe/Moscow').startOf('minute');
			const to = moment.tz('Europe/Moscow');
			let resultList: IOperation[];
			resultList = operationsList.value.filter((item, i) => {
				const operationDate = moment.tz(item.date, 'Europe/Moscow');
				if (!operationDate.isBefore(from) && !operationDate.isAfter(to)) {
					return true;
				}
			});

			return resultList;
		};

		const get_CurrentSelectedTag = () => {
			return currentSelectedTag;
		};

		const set_CurrentSelectedTag = (tag: ITag) => {
			currentSelectedTag = tag;
		};

		const reset_CurrentSelectedTag = () => {
			currentSelectedTag = undefined;
		};

		const get_IsCurrentSelectedExclusionTag = () => {
			return isCurrentSelectedExclusionTag;
		};

		const set_IsCurrentSelectedExclusionTag = (flag: boolean) => {
			isCurrentSelectedExclusionTag = flag;
		};

		return {
			getOperationsList,
			operationsList,
			addOperationToList,
			get_OperationsByStatisticOptions,
			cleanOperationsDeletedCard,
			delete_TodayOperations,
			delete_AllOperations,

			get_operationsByPeriod,

			get_CurrentSelectedTag,
			set_CurrentSelectedTag,
			reset_CurrentSelectedTag,
			get_IsCurrentSelectedExclusionTag,
			set_IsCurrentSelectedExclusionTag,
		};
	},
	{
		persist: true,
	}
);
