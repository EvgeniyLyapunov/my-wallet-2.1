<template>
	<div class="card">
		<div class="card__title-block">
			<h1 class="card__title">{{ card?.cardName }}</h1>
			<VBreadcrumbs class="card__under-title" :items="items"></VBreadcrumbs>
		</div>

		<div class="card__main" :style="{ height: `${cardHeight}px` }">
			<div class="card__main-sum">
				{{
					new Intl.NumberFormat('ru', {
						style: 'currency',
						currency: 'RUB',
						minimumFractionDigits: 0,
					}).format(card!.currentSum)
				}}
			</div>

			<div class="card__main-info">
				<div class="card__main-info-block">
					<span class="card__main-info-label">Date of last modification:</span>
					<span class="card__main-info-value">{{
						moment(card!.changesLastDate).format('DD.MM.YYYY HH:mm')
					}}</span>
				</div>
				<div class="card__main-info-block">
					<span class="card__main-info-label">Type of money on the card:</span>
					<span class="card__main-info-value">{{ card!.cardMoneyType }}</span>
				</div>
				<div class="card__main-info-block">
					<span class="card__main-info-label">Type of the card:</span>
					<span class="card__main-info-value"
						>{{ !card!.isVirtual ? 'Base card' : 'Virtual card of ' }}
						<span v-if="card!.isVirtual" class="card__main-info-value_virtual">{{
							card!.baseCardName
						}}</span>
					</span>
				</div>
			</div>

			<div class="card__main-info-btns">
				<v-btn density="compact" class="delete">Delete card</v-btn>
				<v-btn density="compact">Edit card</v-btn>
			</div>

			<div class="card__main-balance-btn">
				<v-btn
					density="default"
					rounded="lg"
					elevation="16"
					prepend-icon="mdi-swap-horizontal-bold"
				>
					<template v-slot:prepend>
						<v-icon color="primary"></v-icon>
					</template>
					Change balance</v-btn
				>
			</div>
		</div>

		<div class="card__footer">
			<v-btn density="comfortable">Home</v-btn>
			<v-btn density="comfortable">Cancel</v-btn>
		</div>
	</div>
</template>

<script setup lang="ts">
	import moment from 'moment';
	import { useRoute } from 'vue-router';
	import Card from '@/models/Card';
	import { nanoid } from 'nanoid';
	import { useWalletStore } from '@/stores/walletStore';
	import { elementHeight_Relative_PreviousSiblingAndWindowHeight } from '@/utils/elementHeight';

	type RequestCardIdParam = {
		id: string;
	};

	definePage({
		name: 'card-one_view',
		path: '/card-one-view/:id',
	});

	const walletStore = useWalletStore();
	const cardHeight = ref<number>(0);

	const router = useRouter();
	const route = useRoute();
	const id = ref<string>('');
	const card = ref<Card | undefined>();

	const items = [
		{
			title: 'Home',
			disabled: false,
			href: '/',
		},
		{
			title: 'Wallet',
			disabled: false,
			href: '/wallet-view',
		},
		{
			title: 'Cards',
			disabled: false,
			href: '/cards-view',
		},
		{
			title: 'Card',
			disabled: true,
			href: '/cards-view',
		},
	];

	onBeforeMount(() => {
		id.value = (route.params as RequestCardIdParam).id;
		card.value = walletStore.getCard_ById(id.value);
		items[items.length - 1].title = card.value!.cardName;
	});

	onMounted(() => {
		cardHeight.value = elementHeight_Relative_PreviousSiblingAndWindowHeight('.card__title-block');
	});
</script>

<style scoped lang="scss">
	@import './card-one.scss';
</style>
