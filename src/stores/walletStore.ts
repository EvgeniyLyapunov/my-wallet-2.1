import type Card from '@/models/Card';
import { defineStore } from 'pinia';

export const useWalletStore = defineStore(
	'walletStore',
	() => {
		// список карт
		const cardList = ref<Card[]>([]);

		// количество элементов карт на экране
		const startLengthCardsView = 18;

		// список имён карт с учётом их расположения на экране
		const сardsPlacesList = ref<string[]>(Array(startLengthCardsView).fill('empty'));

		// текущая длинна списка имён карт
		const currentCardsPlacesListSize = computed<number>(() => сardsPlacesList.value.length);

		const baseCards_CashMoney_NamesList = computed<string[]>(() => {
			const baseCards = ['base'];
			cardList.value.forEach((card) => {
				if (card.baseCardName === 'base' && card.cardMoneyType === 'cash') {
					baseCards.push(card.cardName);
				}
			});
			return baseCards;
		});

		const baseCards_BankMoney_NamesList = computed<string[]>(() => {
			const baseCards = ['base'];
			cardList.value.forEach((card) => {
				if (card.baseCardName === 'base' && card.cardMoneyType === 'bank') {
					baseCards.push(card.cardName);
				}
			});
			return baseCards;
		});

		const getCardId_ByName = (name: string): string => {
			if (cardList.value.length === 0) return '';
			if (!cardList.value.find((item) => item.cardName === name)) return '';
			return cardList.value.find((item) => item.cardName === name)!.cardId;
		};

		const checkNewCardName = (name: string): boolean => {
			if (cardList.value.length === 0) return true;
			return cardList.value.find((item) => item.cardName === name) ? false : true;
		};

		const getCard_ByName = (name: string): Card | null => {
			if (cardList.value.length === 0) return null;
			if (!cardList.value.find((item) => item.cardName === name)) return null;
			return cardList.value.find((item) => item.cardName === name)!;
		};

		const getCard_ById = (id: string): Card | undefined => {
			if (cardList.value.length === 0) return;
			if (!cardList.value.find((item) => item.cardId === id)) return;
			return cardList.value.find((item) => item.cardId === id)!;
		};

		const setId_ToVirtualListBaseCard = (id: string, baseCardId: string) => {
			if (!getCard_ById(baseCardId)) throw new Error('Нет такой карты!');
			getCard_ById(baseCardId)?.virtualList.push(id);
		};

		const addCard_ToList = (card: Card) => {
			cardList.value.push(card);
			addNewCardOnView(card);
		};

		const addNewCardOnView = (card: Card) => {
			const index = сardsPlacesList.value.indexOf('empty');
			card.screenLocation = index;
			сardsPlacesList.value.splice(index, 1, card.cardName);
		};

		const checkAndGetEmptyPlaceForMoveCard = (index: number): number => {
			if (сardsPlacesList.value[index] === 'empty') return index;
			else {
				for (let i = index + 1; i < сardsPlacesList.value.length; i++) {
					if (сardsPlacesList.value[i] === 'empty') return i;
				}
				for (let i = index - 1; i >= 0; i--) {
					if (сardsPlacesList.value[i] === 'empty') return i;
				}
				return -1;
			}
		};

		const moveCardOnView = (card: Card) => {
			сardsPlacesList.value = сardsPlacesList.value.map((c, i) => {
				if (c === card.cardName) return 'empty';
				if (i === card.screenLocation) return card.cardName;
				return c;
			});
		};

		const removeCard_FromList = (removingCardId: string) => {
			cardList.value = cardList.value.filter((card) => card.cardId !== removingCardId);
		};

		const cardListCount = (): number => {
			return cardList.value.length;
		};

		return {
			cardList,
			сardsPlacesList,
			currentCardsPlacesListSize,
			baseCards_CashMoney_NamesList,
			baseCards_BankMoney_NamesList,
			checkNewCardName,
			addCard_ToList,
			checkAndGetEmptyPlaceForMoveCard,
			moveCardOnView,
			removeCard_FromList,
			cardListCount,
			getCard_ByName,
			getCardId_ByName,
			setId_ToVirtualListBaseCard,
			getCard_ById,
		};
	},
	{
		persist: true,
	}
);
