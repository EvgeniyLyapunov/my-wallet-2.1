import type { ICard } from '@/models/types/cardTypes';
import { defineStore } from 'pinia';
import { useCardsViewStore } from './cardsViewStore';
import moment from 'moment-timezone';

export const useWalletStore = defineStore(
	'walletStore',
	() => {
		const cardViewStore = useCardsViewStore();
		// список карт
		const cardList = ref<ICard[]>([]);

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

		const getGeneralAmount = (): number => {
			if (cardList.value.length === 0) {
				return 0;
			}
			return cardList.value
				.map((item) => {
					if (!item.isVirtual) {
						return item.currentSum;
					} else {
						return 0;
					}
				})
				.reduce((acc, i) => acc! + i!, 0)!;
		};

		const getCardId_ByName = (name: string): string => {
			if (cardList.value.length === 0) return '';
			if (!cardList.value.find((item) => item.cardName === name)) return '';
			return cardList.value.find((item) => item.cardName === name)!.cardId;
		};

		const checkNewCardName = (name: string): boolean => {
			if (cardList.value.length === 0) return true;
			return cardList.value.find((item) => item.cardName === name) ? false : true;
		};

		const getCard_ByName = (name: string): ICard | null => {
			if (cardList.value.length === 0) return null;
			if (!cardList.value.find((item) => item.cardName === name)) return null;
			return cardList.value.find((item) => item.cardName === name)!;
		};

		const getCard_ById = (id: string): ICard | undefined => {
			if (cardList.value.length === 0) return;
			if (!cardList.value.find((item) => item.cardId === id)) return;
			return cardList.value.find((item) => item.cardId === id)!;
		};

		const getSum_AllVirtualCardsOfBaseCard = (card: ICard): number | null => {
			if (card.isVirtual) {
				return null;
			}

			if (card.virtualList.length === 0) {
				return 0;
			}

			const vCards: ICard[] = card.virtualList.map((idcard) => {
				const vc = getCard_ById(idcard)!;
				return vc;
			});

			return vCards.reduce((acc, item) => {
				return acc + item.currentSum;
			}, 0);
		};

		const getVirtualCards_ByBaseCardId = (id: string): ICard[] => {
			const baseCard = getCard_ById(id);
			return baseCard!.virtualList.map((item) => getCard_ById(item)!);
		};

		const addCard_ToList = (card: ICard) => {
			cardList.value.push(card);
			cardViewStore.addNewCardOnView(card);
		};

		const removeCard_FromList = (removingCardId: string) => {
			cardList.value = cardList.value.filter((card) => card.cardId !== removingCardId);
		};

		const cardListCount = (): number => {
			return cardList.value.length;
		};

		const deleteCard = (idCard: string) => {
			const card = getCard_ById(idCard);

			// Удаление всех карт из листа виртуальных карт удаляемой карты
			if (!card!.isVirtual && card!.virtualList.length > 0) {
				card!.virtualList.forEach((vc) => {
					const vcard = getCard_ById(vc);

					cardViewStore.сardsPlacesList = cardViewStore.сardsPlacesList.map((c) => {
						if (c === vcard!.cardName) {
							return 'empty';
						} else {
							return c;
						}
					});

					removeCard_FromList(vc);
				});
			}

			// Удаление удаляемой карты из листа виртуальных карт, если удаляемая карта - виртуальная
			if (card!.isVirtual) {
				const baseCard = getCard_ById(card!.baseCardId!);
				baseCard!.virtualList = baseCard!.virtualList.filter((item) => item !== card!.cardId);
			}

			// Удаление самой карты
			cardViewStore.сardsPlacesList = cardViewStore.сardsPlacesList.map((c) => {
				if (c === card!.cardName) {
					return 'empty';
				} else {
					return c;
				}
			});
			removeCard_FromList(idCard);
		};

		return {
			cardList,
			baseCards_CashMoney_NamesList,
			baseCards_BankMoney_NamesList,
			getGeneralAmount,
			checkNewCardName,
			addCard_ToList,
			removeCard_FromList,
			cardListCount,
			getCard_ByName,
			getCardId_ByName,
			getSum_AllVirtualCardsOfBaseCard,
			getCard_ById,
			getVirtualCards_ByBaseCardId,
			deleteCard,
		};
	},
	{
		persist: true,
	}
);
