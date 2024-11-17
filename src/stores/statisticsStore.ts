import { defineStore } from 'pinia';
import type {
	ITag,
	IStatisticsConfigutation,
	ICard,
	TCardMoney,
	TOperationType,
	IStatisticsSubtitle,
} from '@/models/types/cardTypes';
import moment from 'moment-timezone';

export const useStatisticsStore = defineStore(
	'statisticsStore',
	() => {
		const statisticsConfiguration = reactive<IStatisticsConfigutation>({
			from: moment.tz('Europe/Moscow').startOf('month').format('DD-MM-YYYY HH:mm'),
			to: moment.tz('Europe/Moscow').format('DD-MM-YYYY HH:mm'),
			periodType: 'Current Month',
			card: undefined,
			moneyType: undefined,
			operationType: undefined,
			tags: [],
		});

		const get_StatisticsSubtitle = computed<IStatisticsSubtitle>(() => {
			const subtitle: IStatisticsSubtitle = {
				period: statisticsConfiguration.periodType,
				filters: [],
			};

			if (statisticsConfiguration.card) {
				subtitle.filters.push('Card');
			}

			if (statisticsConfiguration.moneyType) {
				subtitle.filters.push('MoneyType');
			}

			if (statisticsConfiguration.operationType) {
				subtitle.filters.push('OperationType');
			}

			if (statisticsConfiguration.tags.length > 0) {
				subtitle.filters.push('Tags');
			}

			return subtitle;
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
			get_StatisticsSubtitle,
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
