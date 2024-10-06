import type { ICard } from '@/models/types/cardTypes';
import { defineStore } from 'pinia';
import { useWalletStore } from '@/stores/walletStore';
import { useCardsViewStore } from '@/stores/cardsViewStore';
import moment from 'moment-timezone';

export const useCardService = defineStore('cardService', () => {
	const walletStore = useWalletStore();
	const cardViewStore = useCardsViewStore();

	const setId_ToVirtualListBaseCard = (id: string, baseCardId: string) => {
		if (!walletStore.getCard_ById(baseCardId)) throw new Error('Нет такой карты!');
		walletStore.getCard_ById(baseCardId)?.virtualList.push(id);
	};

	const editCardInfo = (card: ICard) => {
		walletStore.deleteCard(card.cardId);

		if (card.baseCardName !== 'base') {
			card.baseCardId = walletStore.getCardId_ByName(card.baseCardName!);
			card.isVirtual = true;
			setId_ToVirtualListBaseCard(card.cardId, card.baseCardId);
		}
		card.changesLastDate = moment.tz('Europe/Moscow').format('DD-MM-YYYY HH:mm');
		walletStore.cardList.push(card);
		cardViewStore.сardsPlacesList.splice(card.screenLocation, 1, card.cardName);
	};

	const cardOperationBalance_Plus = (card: ICard, sum: number) => {
		const currentCard = walletStore.getCard_ById(card.cardId);
		currentCard!.currentSum += sum;
		currentCard!.changesLastDate = moment.tz('Europe/Moscow').format('DD-MM-YYYY HH:mm');
	};

	return {
		setId_ToVirtualListBaseCard,
		editCardInfo,
		cardOperationBalance_Plus,
	};
});
