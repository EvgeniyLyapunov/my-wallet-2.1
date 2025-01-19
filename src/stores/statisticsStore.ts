import { defineStore } from 'pinia';
import type {
	ITag,
	IStatisticOptions,
	ICard,
	TCardMoney,
	TOperationType,
	IStatisticsSubtitle,
	StatisticsPeriodType,
	IStatisticsResume,
} from '@/models/types/cardTypes';
import moment from 'moment-timezone';

export const useStatisticsStore = defineStore('statisticsStore', () => {
	const statisticOptions = reactive<IStatisticOptions>({
		from: moment.tz('Europe/Moscow').startOf('week').toDate(),
		to: moment.tz('Europe/Moscow').toDate(),
		periodType: 'Current Week',
		card: undefined,
		moneyType: undefined,
		operationType: undefined,
		tags: [],
	});

	const get_StatisticsSubtitle = () => {
		const subtitle: IStatisticsSubtitle = {
			period: statisticOptions.periodType,
			filters: [],
		};

		if (statisticOptions.card) {
			subtitle.filters.push('Card');
		}

		if (statisticOptions.moneyType) {
			subtitle.filters.push('MoneyType');
		}

		if (statisticOptions.operationType) {
			subtitle.filters.push('OperationType');
		}

		if (statisticOptions.tags.length > 0) {
			subtitle.filters.push('Tags');
		}

		return subtitle;
	};

	const get_StatisticOptions = (): IStatisticOptions => {
		return statisticOptions;
	};

	const set_StatisticPeriod = (period: StatisticsPeriodType) => {
		statisticOptions.periodType = period;
	};

	const set_FromDate = (from: Date) => {
		statisticOptions.from = from;
	};

	const set_ToDate = (to: Date) => {
		statisticOptions.to = to;
	};

	const set_Card = (cardName: string) => {
		if (cardName === 'All') {
			statisticOptions.card = undefined;
		} else {
			statisticOptions.card = cardName;
		}
	};

	const set_MoneyType = (type: TCardMoney | 'All') => {
		if (type === 'All') {
			statisticOptions.moneyType = undefined;
		} else {
			statisticOptions.moneyType = type;
		}
	};

	const set_operationType = (type: TOperationType | 'All') => {
		if (type === 'All') {
			statisticOptions.operationType = undefined;
		} else {
			statisticOptions.operationType = type;
		}
	};

	const set_Tags = (tags: ITag[]) => {
		statisticOptions.tags = tags;
	};

	return {
		statisticOptions,
		get_StatisticsSubtitle,
		get_StatisticOptions,
		set_StatisticPeriod,
		set_FromDate,
		set_ToDate,
		set_Card,
		set_MoneyType,
		set_operationType,
		set_Tags,
	};
});
