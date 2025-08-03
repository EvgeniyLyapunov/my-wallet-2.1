<template>
	<div class="statistic">
		<div class="statistic__title-block">
			<h1 class="statistic__title">Статистика</h1>
			<div class="breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Домашняя</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">Статистика</span>
			</div>
		</div>
		<div class="statistic__menu">
			<router-link :to="{ name: 'stat-all-operations' }" class="statistic__menu-link">
				<span class="statistic__menu-link-item">Движение средств</span>
			</router-link>

			<router-link :to="{ name: 'statistic_daily_limit' }" class="statistic__menu-link">
				<span class="statistic__menu-link-item">Ежедневный лимит</span>
			</router-link>

			<router-link :to="{ name: 'newCard_view' }" class="statistic__menu-link">
				<span class="statistic__menu-link-item">Месячный остаток</span>
			</router-link>

			<router-link :to="{ name: 'newCard_view' }" class="statistic__menu-link">
				<span class="statistic__menu-link-item">Теги по месяцам</span>
			</router-link>

			<router-link :to="{ name: 'options-view' }" class="statistic__menu-link">
				<span class="statistic__menu-link-item">Опции</span>
			</router-link>

			<router-link :to="{ name: 'home_view' }" class="statistic__menu-link">
				<span class="statistic__menu-link-item">Домой</span>
			</router-link>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { ICard } from '@/models/types/cardTypes';
	import { useWalletStore } from '@/stores/walletStore';
	import { useStatisticWalletService } from '@/services/statisticWalletService';

	definePage({
		name: 'statistics_view',
		path: '/statistics-view',
	});

	const router = useRouter();
	const breadcrumbsDivider: string = '/';

	const walletStore = useWalletStore();
	const statisticWalletService = useStatisticWalletService();

	const generalAmount = ref<number>(0);
	const bank = ref<string>('');
	const cash = ref<string>('');
	const bankBaseCards = ref<ICard[]>([]);
	const cashBaseCards = ref<ICard[]>([]);

	onMounted(() => {
		generalAmount.value = statisticWalletService.getGeneralAmount();
		bank.value = `${new Intl.NumberFormat('ru', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 0,
		}).format(statisticWalletService.getBankCardsAmount())}`;
		cash.value = `${new Intl.NumberFormat('ru', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 0,
		}).format(statisticWalletService.getCashCardsAmount())}`;
		bankBaseCards.value = walletStore.cardList.filter(
			(item) => item.baseCardName === 'base' && item.cardMoneyType === 'bank'
		);
		cashBaseCards.value = walletStore.cardList.filter(
			(item) => item.baseCardName === 'base' && item.cardMoneyType === 'cash'
		);
	});

	const onRouteStatistics = () => {
		router.push('/statistics');
	};

	const onRouteHome = () => {
		router.push('/');
	};
</script>

<style scoped lang="scss">
	@import './statistics-view.scss';
</style>
