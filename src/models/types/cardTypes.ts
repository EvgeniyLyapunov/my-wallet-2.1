import cachIcon from '@/assets/images/icons/cash.png';
import bankIcon from '@/assets/images/icons/bank-card.png';

export interface ITag {
	Id: string;
	Name: string;
}

export type TOperationType = 'plus' | 'minus' | 'changeBalance_Plus' | 'changeBalance_Minus';

export interface IOperation {
	date: Date;
	amount: number;
	type: TOperationType;
	cardId: string;
	tags?: string[]; // id тегов
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
export type StatisticsPeriodType = 'Current Month' | 'Salary Month' | 'Custom Period';

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
export interface IStatisticsConfigutation {
	from: string;
	to: string;
	periodType: StatisticsPeriodType;
	tags: ITag[];
	moneyType?: TCardMoney;
	operationType?: TOperationType;
	card?: ICard;
}

export interface IAppSettings {
	MoneyMonthStartDate: number;
	isSaveLastStatisticsSet: boolean;
}
