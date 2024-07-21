<template>
	<div class="cards">
		<div class="cards__title-block">
			<h1 class="cards__title">Cards</h1>
			<v-breadcrumbs class="cards__under-title" :items="items"></v-breadcrumbs>
		</div>
		<div class="cards__area">
			<div
				v-for="(obj, i) in walletStore.сardsPlacesList"
				:key="i"
				class="cards__area-place"
				:data-place="i"
			>
				<CardObjectComponent
					v-if="obj !== 'empty'"
					:card-name="getCardObjName(obj)"
					:card-icon="getCardIcon(obj)"
				/>
			</div>
		</div>
		<v-spacer></v-spacer>
		<div class="cards__btns">
			<v-btn density="compact" width="120" variant="elevated" @click="handleGoHome">Home</v-btn>
			<v-btn density="compact" width="120" variant="elevated" @click="handleToNewCardPage"
				>New Card</v-btn
			>
		</div>
	</div>
</template>

<script setup lang="ts">
	import Card from '@/models/Card';
	import { useWalletStore } from '@/stores/walletStore';
	import CardObjectComponent from '@/pages/components/cards-view/CardObjectComponent.vue';

	definePage({
		name: 'cards_view',
		path: '/cards-view',
	});

	const router = useRouter();
	const walletStore = useWalletStore();

	onMounted(() => {
		const places = document.querySelectorAll('.card-place');
		places.forEach((i) => {
			console.log((i as HTMLElement).dataset.place);
		});
	});

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
			disabled: true,
			href: '/cards-view',
		},
	];

	function getCardObjName(cardName: string) {
		if (cardName.length <= 10) return cardName;

		const cardObjName = cardName.substring(0, 10) + '...';
		return cardObjName;
	}

	function getCardIcon(cardName: string) {
		if (cardName === 'empty') return 'empty';

		const iconPath = walletStore.cardList.find((item) => item.cardName === cardName)!.cardIcon!;

		return iconPath;
	}

	function handleGoHome() {
		router.push('/');
	}

	function handleToNewCardPage() {
		router.push('/new-card-view');
	}
</script>

<style scoped lang="scss">
	@import './cards.scss';
</style>
