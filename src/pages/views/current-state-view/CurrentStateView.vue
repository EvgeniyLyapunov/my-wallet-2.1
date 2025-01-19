<template>
	<div class="current-state cs">
		<div class="cs__title-block">
			<h1 class="cs__title">Current state</h1>
			<div class="cs__breadcrumbs breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Home</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">Current state</span>
			</div>
		</div>
		<div class="cs__main">
			<div class="cs__main-general">
				<span class="cs__main-general-label">Wallet:</span>
				<span class="cs__main-general-amount">{{
					new Intl.NumberFormat('ru', {
						style: 'currency',
						currency: 'RUB',
						minimumFractionDigits: 0,
					}).format(generalAmount)
				}}</span>
			</div>

			<!-- <div class="cs__main-divider"></div> -->

			<div class="cs__main-cards">
				<!-- bank -->
				<v-expansion-panels class="my-4" variant="default">
					<!-- type bank -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							<div class="cs__main-cards-card">
								<span class="cs__main-cards-card-label cs__main-cards-card-type-label"
									>Bank:&nbsp;&nbsp;&nbsp;</span
								>
								<span class="cs__main-cards-card-value cs__main-cards-card-type-value">{{
									bank
								}}</span>
							</div>
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<!-- base bank -->
							<v-expansion-panels class="my-4" variant="default">
								<v-expansion-panel v-for="(item, i) in bankBaseCards" :key="i">
									<v-expansion-panel-title>
										<div class="cs__main-cards-card">
											<span class="cs__main-cards-card-label"
												>{{ item.cardName }}:&nbsp;&nbsp;&nbsp;</span
											>
											<span class="cs__main-cards-card-value">{{
												new Intl.NumberFormat('ru', {
													style: 'currency',
													currency: 'RUB',
													minimumFractionDigits: 0,
												}).format(item.currentSum)
											}}</span>
										</div>
										<!-- virtuals bank -->
									</v-expansion-panel-title>
									<v-expansion-panel-text>
										<div
											v-for="(vcard, i) in walletStore.getVirtualCards_ByBaseCardId(item.cardId!)"
											:key="i"
											class="cs__main-cards-card"
										>
											<span class="cs__main-cards-card-label"
												>{{ vcard.cardName }}:&nbsp;&nbsp;&nbsp;</span
											>
											<span class="cs__main-cards-card-value">{{
												new Intl.NumberFormat('ru', {
													style: 'currency',
													currency: 'RUB',
													minimumFractionDigits: 0,
												}).format(vcard.currentSum)
											}}</span>
										</div>
									</v-expansion-panel-text>
								</v-expansion-panel>
							</v-expansion-panels>
						</v-expansion-panel-text>
					</v-expansion-panel>
				</v-expansion-panels>
				<!-- cash -->
				<v-expansion-panels class="my-4" variant="default">
					<!-- type cash -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							<div class="cs__main-cards-card">
								<span class="cs__main-cards-card-label cs__main-cards-card-type-label"
									>Cash:&nbsp;&nbsp;&nbsp;</span
								>
								<span class="cs__main-cards-card-value cs__main-cards-card-type-value">{{
									cash
								}}</span>
							</div>
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<!-- base cash -->
							<v-expansion-panels class="my-4" variant="default">
								<v-expansion-panel v-for="(item, i) in cashBaseCards" :key="i">
									<v-expansion-panel-title>
										<div class="cs__main-cards-card">
											<span class="cs__main-cards-card-label"
												>{{ item.cardName }}:&nbsp;&nbsp;&nbsp;</span
											>
											<span class="cs__main-cards-card-value">{{
												new Intl.NumberFormat('ru', {
													style: 'currency',
													currency: 'RUB',
													minimumFractionDigits: 0,
												}).format(item.currentSum)
											}}</span>
										</div>
									</v-expansion-panel-title>
									<!-- viruals cash -->
									<v-expansion-panel-text>
										<div
											v-for="(vcard, i) in walletStore.getVirtualCards_ByBaseCardId(item.cardId!)"
											:key="i"
											class="cs__main-cards-card"
										>
											<span class="cs__main-cards-card-label"
												>{{ vcard.cardName }}:&nbsp;&nbsp;&nbsp;</span
											>
											<span class="cs__main-cards-card-value">{{
												new Intl.NumberFormat('ru', {
													style: 'currency',
													currency: 'RUB',
													minimumFractionDigits: 0,
												}).format(vcard.currentSum)
											}}</span>
										</div>
									</v-expansion-panel-text>
								</v-expansion-panel>
							</v-expansion-panels>
						</v-expansion-panel-text>
					</v-expansion-panel>
				</v-expansion-panels>
			</div>
		</div>
		<div class="cs__footer">
			<v-btn class="cs__footer-btn cs__footer-btn-statistic" @click="onRouteStatistics"
				>Statistic</v-btn
			>
			<v-btn class="cs__footer-btn cs__footer-btn-home" @click="onRouteHome">Home</v-btn>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { ICard } from '@/models/types/cardTypes';
	import { useWalletStore } from '@/stores/walletStore';
	import { useStatisticWalletService } from '@/services/statisticWalletService';

	definePage({
		name: 'currentState_view',
		path: '/current-state-view',
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
	@import './current-state-view.scss';
</style>
