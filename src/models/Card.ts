import { nanoid } from 'nanoid';
import Operation from '@/models/Operation';
import type { TCardIcon, TCardMoney } from '@/models/types/cardTypes';
import moment from 'moment';

class Card {
	cardId: string;
	cardName: string;
	cardMoneyType: TCardMoney;
	isVirtual: boolean;
	baseCardName: string | null;
	baseCardId: string | null;
	virtualList: string[];
	currentSum: number;
	operationHistory: Operation[];
	screenLocation: number;
	cardIcon?: TCardIcon;
	changesLastDate: Date;

	constructor() {
		this.cardId = nanoid();
		this.cardName = '';
		this.cardMoneyType = 'cash';
		this.isVirtual = false;
		this.baseCardName = null;
		this.baseCardId = null;
		this.virtualList = [];
		this.currentSum = 0;
		this.operationHistory = [];
		this.screenLocation = 0;
		this.changesLastDate = moment().toDate();
	}

	changeCardSum = (newSum: number): void => {
		this.currentSum = newSum;
	};

	cardSum_Increase = (num: number) => {
		this.currentSum -= num;
	};

	cardSum_Decrease = (num: number) => {
		this.currentSum += num;
	};
}

export default Card;
