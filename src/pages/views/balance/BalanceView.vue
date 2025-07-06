<template>
	<div class="balance-view bv">
		<header class="bv__title-block">
			<h1 class="bv__title">Баланс</h1>
			<div class="bv__breadcrumbs breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Домашняя</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">Баланс</span>
			</div>
		</header>

		<main class="bv-main">
			<!-- General -->
			<section class="bv-main__general">
				<div class="bv-main__general-field">
					<v-icon class="bv-main__general-field__icon" color="#01579b">mdi-bank</v-icon>
					<span class="bv-main__general-field__label">Банк:</span>
					<span class="bv-main__general-field__value">{{
						new Intl.NumberFormat('ru', {
							style: 'currency',
							currency: 'RUB',
							minimumFractionDigits: 0,
						}).format(generalBank)
					}}</span>
				</div>
				<div class="bv-main__general-field">
					<v-icon class="bv-main__general-field__icon" color="#2E7D32">mdi-cash-multiple</v-icon>
					<span class="bv-main__general-field__label">Наличные:</span>
					<span class="bv-main__general-field__value">{{
						new Intl.NumberFormat('ru', {
							style: 'currency',
							currency: 'RUB',
							minimumFractionDigits: 0,
						}).format(generalCash)
					}}</span>
				</div>
			</section>
			<!-- Bank -->
			<section class="bv-main__money">
				<div class="bv-main__money__picto">
					<v-icon class="bv-main__money__picto-icon" color="#01579b">mdi-bank</v-icon>
				</div>
				<ul class="bv-main__money__list">
					<li v-for="item in baseCards_Bank" :key="item.cardId" class="bv-main__money__card">
						<!-- base -->
						<div class="bv-main__money__card-base">
							<span class="bv-main__money__card-base-name">{{ item ? item.cardName : '' }}:</span>
							<span class="bv-main__money__card-base-amount">{{
								item
									? new Intl.NumberFormat('ru', {
											style: 'currency',
											currency: 'RUB',
											minimumFractionDigits: 0,
									  }).format(item.currentSum)
									: ''
							}}</span>
						</div>
						<!-- virtual -->
						<div
							v-if="item.virtualList.length > 0"
							v-for="unit in getVirtualCards_ByBaseCardId(item.cardId)"
							class="bv-main__money__card-virtuals"
						>
							<v-icon class="bv-main__money__card-virtuals-icon" color="#ffff00">
								mdi-alpha-v-box
							</v-icon>
							<span class="bv-main__money__card-virtuals-name">{{
								unit ? unit.cardName : ''
							}}</span>
							<span class="bv-main__money__card-virtuals-amount">{{
								unit
									? new Intl.NumberFormat('ru', {
											style: 'currency',
											currency: 'RUB',
											minimumFractionDigits: 0,
									  }).format(unit.currentSum)
									: ''
							}}</span>
						</div>
					</li>
				</ul>
			</section>
			<!-- Cash -->
			<section class="bv-main__money">
				<div class="bv-main__money__picto">
					<v-icon class="bv-main__money__picto-icon" color="#2E7D32">mdi-cash-multiple</v-icon>
				</div>
				<ul class="bv-main__money__list">
					<li v-for="item in baseCards_Cash" :key="item.cardId" class="bv-main__money__card">
						<!-- base -->
						<div class="bv-main__money__card-base">
							<span class="bv-main__money__card-base-name">{{ item ? item.cardName : '' }}:</span>
							<span class="bv-main__money__card-base-amount">{{
								item
									? new Intl.NumberFormat('ru', {
											style: 'currency',
											currency: 'RUB',
											minimumFractionDigits: 0,
									  }).format(item.currentSum)
									: ''
							}}</span>
						</div>
						<!-- virtual -->
						<div
							v-if="item.virtualList.length > 0"
							v-for="unit in getVirtualCards_ByBaseCardId(item.cardId)"
							class="bv-main__money__card-virtuals"
						>
							<v-icon class="bv-main__money__card-virtuals-icon" color="#ffff00">
								mdi-alpha-v-box
							</v-icon>
							<span class="bv-main__money__card-virtuals-name">{{
								unit ? unit.cardName : ''
							}}</span>
							<span class="bv-main__money__card-virtuals-amount">{{
								unit
									? new Intl.NumberFormat('ru', {
											style: 'currency',
											currency: 'RUB',
											minimumFractionDigits: 0,
									  }).format(unit.currentSum)
									: ''
							}}</span>
						</div>
					</li>
				</ul>
			</section>
		</main>

		<!-- actions -->
		<div class="bv-actions">
			<v-btn class="bv-actions__home-btn" prepend-icon="mdi-home" @click="onRouteHome">Домой</v-btn>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useStatisticWalletService } from '@/services/statisticWalletService';
	import { useWalletStore } from '@/stores/walletStore';
	import type { ICard } from '@/models/types/cardTypes';

	definePage({
		name: 'balance_view',
		path: '/balance-view',
	});

	const { getBankCardsAmount, getCashCardsAmount } = useStatisticWalletService();
	const { baseCardList_Bank, baseCardList_Cash, getCard_ByName, getVirtualCards_ByBaseCardId } =
		useWalletStore();

	const generalBank = ref<number>(0);
	const generalCash = ref<number>(0);

	generalBank.value = getBankCardsAmount();
	generalCash.value = getCashCardsAmount();

	const baseCards_Bank = ref<ICard[]>([]);
	const baseCards_Cash = ref<ICard[]>([]);

	baseCards_Bank.value = baseCardList_Bank();
	baseCards_Cash.value = baseCardList_Cash();

	const router = useRouter();
	const breadcrumbsDivider: string = '/';

	const onRouteHome = () => {
		router.push('/');
	};
</script>

<style scoped lang="scss">
	@import './balance-view.scss';
</style>
