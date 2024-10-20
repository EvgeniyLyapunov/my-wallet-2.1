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
			<div class="cs__main-divider"></div>
			<div class="cs__main-cards">
				<v-expansion-panels class="my-4" variant="default">
					<v-expansion-panel>
						<v-expansion-panel-title>
							<div class="cs__main-cards-bank">
								<span class="cs__main-cards-bank-label">Bank:&nbsp;&nbsp;&nbsp;</span>
								<span class="cs__main-cards-bank-value">{{ bank }}</span>
							</div>
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<v-expansion-panels class="my-4" variant="default">
								<v-expansion-panel v-for="(item, i) in bankBaseCards" :key="i">
									<v-expansion-panel-title>
										<div class="cs__main-cards-bank">
											<span class="cs__main-cards-bank-label"
												>{{ item.cardName }}:&nbsp;&nbsp;&nbsp;</span
											>
											<span class="cs__main-cards-bank-value">{{
												new Intl.NumberFormat('ru', {
													style: 'currency',
													currency: 'RUB',
													minimumFractionDigits: 0,
												}).format(item.currentSum)
											}}</span>
										</div>
									</v-expansion-panel-title>
									<v-expansion-panel-text>
										<div
											v-for="(vcard, i) in walletStore.getVirtualCards_ByBaseCardId(item.cardId!)"
											:key="i"
											class="cs__main-cards-bank"
										>
											<span class="cs__main-cards-bank-label"
												>{{ vcard.cardName }}:&nbsp;&nbsp;&nbsp;</span
											>
											<span class="cs__main-cards-bank-value">{{
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
				<v-expansion-panels class="my-4" variant="inset"> </v-expansion-panels>
			</div>
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

	onMounted(() => {
		generalAmount.value = statisticWalletService.getGeneralAmount();
		bank.value = `${new Intl.NumberFormat('ru', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 0,
		}).format(statisticWalletService.getBankCardsAmount())}`;
		bankBaseCards.value = walletStore.cardList.filter((item) => item.baseCardName === 'base');
	});

	const onRouteHome = () => {
		router.push('/');
	};
</script>

<style scoped lang="scss">
	@import './current-state-view.scss';
</style>
