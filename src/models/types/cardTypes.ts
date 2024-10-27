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

export interface IStatisticsConfigutation {
	from: string;
	to: string;
	tags: ITag[];
	moneyType?: TCardMoney;
	operationType?: TOperationType;
	card?: ICard;
}

export interface IAppSettings {
	MoneyMonthStartDate: number;
	isSaveLastStatisticsSet: boolean;
}
