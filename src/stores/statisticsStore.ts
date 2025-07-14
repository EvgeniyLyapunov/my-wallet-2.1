import { defineStore } from 'pinia';
import { useSettingsStore } from '@/stores/settingsStore';
import type {
	ITag,
	IStatisticOptions,
	ICard,
	TCardMoney,
	TOperationType,
	IStatisticsSubtitle,
	StatisticsPeriodType,
	IStatisticsResume,
	IStatAllOptions,
} from '@/models/types/cardTypes';
import moment from 'moment-timezone';

export const useStatisticsStore = defineStore('statisticsStore', () => {
	const { get_SettingsObject } = useSettingsStore();

	const statisticOptions = reactive<IStatisticOptions>({
		from: moment.tz('Europe/Moscow').startOf('day').toDate(),
		to: moment.tz('Europe/Moscow').toDate(),
		periodType: 'Today',
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
		statAllPeriodOption.periodType = period;
		initPeriodDates(period);
	};

	const set_FromDate = (from: Date) => {
		statisticOptions.from = from;
		statAllPeriodOption.from = from;
		statAllPeriodOption.changesDateTime = moment.tz('Europe/Moscow').startOf('minute').toDate();
	};

	const set_ToDate = (to: Date) => {
		statisticOptions.to = to;
		statAllPeriodOption.to = to;
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

	const statAllPeriodOption = reactive<IStatAllOptions>({
		from: moment.tz('Europe/Moscow').startOf('day').toDate(),
		to: moment.tz('Europe/Moscow').toDate(),
		periodType: 'Today',
		changesDateTime: null,
	});

	const get_StatAllPeriodOption = (): IStatAllOptions => {
		const lastChanged = moment(statAllPeriodOption.changesDateTime);
		if (statAllPeriodOption.changesDateTime === null || isMoreThanOneHourAgo(lastChanged)) {
			const currentDay = moment().date();
			if (currentDay > get_SettingsObject().salaryMonthStart) {
				// Если текущий день больше числа начала фин месяца, получаем дату этого месяца
				statAllPeriodOption.from = moment()
					.date(get_SettingsObject().salaryMonthStart)
					.startOf('day')
					.toDate();
			} else {
				// Если текущий день меньше числа начала фин месяца, получаем дату прошлого месяца
				statAllPeriodOption.from = moment()
					.subtract(1, 'months')
					.date(get_SettingsObject().salaryMonthStart)
					.startOf('day')
					.toDate();
			}
			statAllPeriodOption.to = moment.tz('Europe/Moscow').toDate();
			(statAllPeriodOption.periodType = 'Salary Month'),
				(statAllPeriodOption.changesDateTime = null);
		}
		return statAllPeriodOption;
	};

	/**
	 * Функция для проверки, была ли дата более часа назад.
	 * @param {moment.Moment} date - Дата для проверки (объект moment).
	 * @returns {boolean} - true, если дата была более часа назад, иначе false.
	 */
	function isMoreThanOneHourAgo(date: moment.Moment) {
		// Пороговое значение: текущее время минус один час
		const oneHourAgo = moment.tz('Europe/Moscow').subtract(1, 'hour');

		// Проверяем, находится ли наша дата до этого порогового значения
		return date.isBefore(oneHourAgo);
	}

	const initPeriodDates = (period: StatisticsPeriodType) => {
		switch (period) {
			case 'Today':
				set_FromDate(moment().startOf('day').toDate());
				break;
			case 'Current Week':
				set_FromDate(moment().startOf('week').toDate());
				break;
			case 'Current Month':
				set_FromDate(moment().startOf('month').toDate());
				break;
			case 'Salary Month':
				const currentDay = moment().date();

				if (currentDay > get_SettingsObject().salaryMonthStart) {
					// Если текущий день больше числа начала фин месяца, получаем дату этого месяца
					set_FromDate(
						moment().date(get_SettingsObject().salaryMonthStart).startOf('day').toDate()
					);
				} else {
					// Если текущий день меньше числа начала фин месяца, получаем дату прошлого месяца
					set_FromDate(
						moment()
							.subtract(1, 'months')
							.date(get_SettingsObject().salaryMonthStart)
							.startOf('day')
							.toDate()
					);
				}
				break;
		}
		set_ToDate(moment.tz('Europe/Moscow').startOf('minute').toDate());
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

		statAllPeriodOption,
		get_StatAllPeriodOption,
	};
});
