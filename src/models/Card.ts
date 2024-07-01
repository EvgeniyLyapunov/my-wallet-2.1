import { nanoid } from 'nanoid';
import Operation from '@/models/Operation';
import type { TCardIcon, TCardMoney } from '@/models/types/cardTypes';

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
	}
}

export default Card;
