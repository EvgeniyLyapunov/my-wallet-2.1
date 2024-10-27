import { defineStore } from 'pinia';
import type {
	ITag,
	IStatisticsConfigutation,
	ICard,
	TCardMoney,
	TOperationType,
} from '@/models/types/cardTypes';
import moment from 'moment-timezone';

export const useStatisticsStore = defineStore(
	'statisticsStore',
	() => {
		const statisticsConfiguration = reactive<IStatisticsConfigutation>({
			from: moment.tz('Europe/Moscow').format('DD-MM-YYYY HH:mm'),
			to: moment.tz('Europe/Moscow').format('DD-MM-YYYY HH:mm'),
			card: undefined,
			moneyType: undefined,
			operationType: undefined,
			tags: [],
		});

		const get_StatisticsConfiguration = (): IStatisticsConfigutation => {
			return { ...statisticsConfiguration };
		};

		const set_FromDate = (from: string) => {
			statisticsConfiguration.from = from;
		};

		const set_ToDate = (to: string) => {
			statisticsConfiguration.to = to;
		};

		const set_Card = (card: ICard) => {
			statisticsConfiguration.card = card;
		};

		const set_MoneyType = (type: TCardMoney) => {
			statisticsConfiguration.moneyType = type;
		};

		const set_operationType = (type: TOperationType) => {
			statisticsConfiguration.operationType = type;
		};

		const set_Tags = (tags: ITag[]) => {
			statisticsConfiguration.tags = [...statisticsConfiguration.tags, ...tags];
		};

		return {
			statisticsConfiguration,
			get_StatisticsConfiguration,
			set_FromDate,
			set_ToDate,
			set_Card,
			set_MoneyType,
			set_operationType,
			set_Tags,
		};
	},
	{
		persist: true,
	}
);
