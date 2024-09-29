import type { ICard } from '@/models/types/cardTypes';
import { defineStore } from 'pinia';

export const useCardsViewStore = defineStore(
	'cardsViewStore',
	() => {
		// количество элементов карт на экране
		const startLengthCardsView = 18;

		// список имён карт с учётом их расположения на экране
		const сardsPlacesList = ref<string[]>(Array(startLengthCardsView).fill('empty'));

		// текущая длинна списка имён карт
		const currentCardsPlacesListSize = computed<number>(() => сardsPlacesList.value.length);

		const addNewCardOnView = (card: ICard) => {
			const index = сardsPlacesList.value.indexOf('empty');
			card.screenLocation = index;
			сardsPlacesList.value.splice(index, 1, card.cardName);
		};

		const checkAndGetEmptyPlaceForMoveCard = (index: number, name: string): number => {
			if (сardsPlacesList.value[index] === 'empty' || сardsPlacesList.value[index] === name)
				return index;
			else {
				for (let i = index + 1; i < сardsPlacesList.value.length; i++) {
					if (сardsPlacesList.value[i] === 'empty' || сardsPlacesList.value[i] === name) return i;
				}
				for (let i = index - 1; i >= 0; i--) {
					if (сardsPlacesList.value[i] === 'empty' || сardsPlacesList.value[i] === name) return i;
				}
				return -1;
			}
		};

		const checkPlaceForCardShadow = (index: number, name: string): number => {
			if (сardsPlacesList.value[index] === 'empty' || сardsPlacesList.value[index] === name)
				return index;
			else {
				for (let i = index + 1; i < сardsPlacesList.value.length; i++) {
					if (сardsPlacesList.value[i] === 'empty' || сardsPlacesList.value[i] === name) return i;
				}
				for (let i = index - 1; i >= 0; i--) {
					if (сardsPlacesList.value[i] === 'empty' || сardsPlacesList.value[i] === name) return i;
				}
				return -1;
			}
		};

		const moveCardOnView = (card: ICard) => {
			сardsPlacesList.value = сardsPlacesList.value.map((c, i) => {
				if (c === card.cardName && i === card.screenLocation) return card.cardName;
				if (c === card.cardName && i !== card.screenLocation) return 'empty';
				if (i === card.screenLocation) return card.cardName;
				return c;
			});
		};

		return {
			startLengthCardsView,
			сardsPlacesList,
			currentCardsPlacesListSize,
			addNewCardOnView,
			checkAndGetEmptyPlaceForMoveCard,
			checkPlaceForCardShadow,
			moveCardOnView,
		};
	},
	{
		persist: true,
	}
);
