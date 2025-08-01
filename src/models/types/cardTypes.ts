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
	tag?: string; // id тега
	exclusionTag: boolean;
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
export type StatisticsPeriodType = 'Today' | 'Current Week' | 'Current Month' | 'Salary Month';

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

/**
 * объект опций графика статистики Движение средств
 */
export interface IStatOptions {
	from: Date;
	to: Date;
	periodType: StatisticsPeriodType;
	changesDateTime: Date | null; // дата изменения периода, если не менялся больше часа то по умолчанию 'salary month'
}

/**
 * объект резюме текущего графика статистики
 */
export interface IStatisticsResume {
	begin: Date;
	end: Date;
	amount: number;
	dynamicLimit?: string;
}

/**
 * объект резюме графика статистики Движение средств
 */
export interface IStatAllResume {
	begin: Date;
	end: Date;
	amount: number;
}

/**
 *
 */
export interface IStatDailyLimit extends IStatAllResume {
	dailyLimit: number;
	dynamicDailyLimit: number;
}

/**
 * тип временного периода для расчёта динамического дневного лимита расходов
 */
export type DailyLimitPeriodType = 'Current Week' | 'Current Month' | 'Salary Month' | undefined;

export interface ISettings {
	salaryMonthStart: number;
	isSaveLastStatisticOptions: boolean;
	dailyLimit: number;
	dailyLimitPeriod: DailyLimitPeriodType;
}
