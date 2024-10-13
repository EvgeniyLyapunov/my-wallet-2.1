import cachIcon from '@/assets/images/icons/cash.png';
import bankIcon from '@/assets/images/icons/bank-card.png';

export interface ITag {
	Id: string;
	Name: string;
}

export interface IOperation {
	date: string;
	amount: number;
	type: 'plus' | 'minus' | 'changeBalance';
	cardId: string;
	tags?: string[]; // id тегов
}

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

export type TCardMoney = 'cash' | 'bank';
export type TCardIcon = typeof cachIcon | typeof bankIcon;

export type TWallet = Record<string, ICard>;
