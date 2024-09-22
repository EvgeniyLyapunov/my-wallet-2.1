import type Card from '@/models/Card';
import type Operation from '@/models/Operation';
import type Tag from '@/models/Tag';
import { defineStore } from 'pinia';
import { useWalletStore } from './walletStore';

export const useCardBalanceStore = defineStore(
	'cardBalanceStore',
	() => {
		const walletStore = useWalletStore();

		const operationHistory = ref<Operation[]>([]);

		const tags = ref<Tag[]>([]);

		const getAmountBaseCard_ByVirtualCard = (card: Card): number => {
			const baseCard = walletStore.getCard_ById(card.baseCardId!);
			return baseCard!.currentSum;
		};

		const getAmountAllVirtualsOfBaseCard = (card: Card): number => {
			const baseCard = walletStore.getCard_ById(card.baseCardId!);
			let amountOfAllVirtuals = 0;
			baseCard!.virtualList.forEach((id) => {
				const vcard = walletStore.getCard_ById(id);
				amountOfAllVirtuals += vcard!.currentSum;
			});
			return amountOfAllVirtuals;
		};

		const setBalancePlus = (card: Card, sum: number) => {
			if (card.isVirtual) {
				const baseCardAmount = getAmountBaseCard_ByVirtualCard(card);
				const virtualsAmount = getAmountAllVirtualsOfBaseCard(card);
			}
			card.cardSum_Increase(sum);
		};

		const setBalanceMinus = (card: Card, sum: number) => {
			card.cardSum_Decrease(sum);
		};

		const setChangeBalance = (card: Card, sum: number) => {
			card.changeCardSum(sum);
		};

		return {
			operationHistory,
			tags,
			setBalancePlus,
			setBalanceMinus,
			setChangeBalance,
		};
	},
	{
		persist: true,
	}
);
