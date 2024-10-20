import { defineStore } from 'pinia';
import { useWalletStore } from '@/stores/walletStore';

export const useStatisticWalletService = defineStore('statisticWalletService', () => {
	const walletStore = useWalletStore();

	const getGeneralAmount = (): number => {
		if (walletStore.cardList.length === 0) {
			return 0;
		}
		return walletStore.cardList
			.map((item) => {
				if (!item.isVirtual) {
					return item.currentSum;
				} else {
					return 0;
				}
			})
			.reduce((acc, i) => acc! + i!, 0)!;
	};

	const getBankCardsAmount = (): number => {
		if (walletStore.cardList.length === 0) {
			return 0;
		}

		return walletStore.cardList
			.map((item) => {
				if (!item.isVirtual && item.cardMoneyType === 'bank') {
					return item.currentSum;
				} else {
					return 0;
				}
			})
			.reduce((acc, i) => acc! + i!, 0)!;
	};

	return {
		getGeneralAmount,
		getBankCardsAmount,
	};
});
