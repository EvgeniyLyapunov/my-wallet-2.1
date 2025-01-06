import cachIcon from '@/assets/images/icons/cash.png';
import bankIcon from '@/assets/images/icons/bank-card.png';

export interface ITag {
	Id: string;
	Name: string;
}

export type TOperationType = 'plus' | 'minus';

export interface IOperation {
	date: Date;
	amount: number;
	moneyType: TCardMoney;
	type: TOperationType;
	cardId: string;
	tags: string[]; // id тегов
}

export type TCardMoney = 'cash' | 'bank';
export type TCardIcon = typeof cachIcon | typeof bankIcon;

export interface ICard {
	cardId: string;
	cardName: string;
	cardMoneyType?: TCardMoney;
	isVirtual: boolean;
	baseCardName: string | null;
	baseCardId: string | null;
	virtualList: string[];
	currentSum: number;
	screenLocation: number;
	cardIcon?: TCardIcon;
	changesLastDate: string;
}

export type TWallet = Record<string, ICard>;

/**
 * тип временного периода для отображаемой статистики
 */
export type StatisticsPeriodType = 'Current Week' | 'Current Month' | 'Salary Month';

/**
 * типы фильтров для статистики
 */
export type StatisticsFiltersType = 'Card' | 'MoneyType' | 'OperationType' | 'Period' | 'Tags';

/**
 * Объект предисловия, (subtitle)
 */
export interface IStatisticsSubtitle {
	period: StatisticsPeriodType;
	filters: StatisticsFiltersType[];
}

/**
 * объект статистики
 */
export interface IStatisticOptions {
	from: Date;
	to: Date;
	periodType: StatisticsPeriodType;
	tags: ITag[];
	moneyType?: TCardMoney;
	operationType?: TOperationType;
	card?: string;
}

export interface IAppSettings {
	salaryMonthStart: number;
	isSaveLastStatisticOptions: boolean;
}
