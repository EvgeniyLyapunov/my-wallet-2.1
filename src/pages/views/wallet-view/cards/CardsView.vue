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
					:data-cardname="obj"
					@mousedown="startLongPress"
					@mouseup="endLongPress"
					@mouseleave="endLongPress"
					@touchstart="startLongPress"
					@touchend="endLongPress"
					@touchmove="endLongPress"
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

	const longPressTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
	const targetElement = ref<HTMLElement | null>(null); // Состояние для хранения целевого элемента
	const isLongPress = ref<boolean>(false);

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

	function startLongPress(e: MouseEvent | TouchEvent) {
		targetElement.value = e.currentTarget as HTMLElement; // Сохраняем текущий элемент
		longPressTimeout.value = setTimeout(() => {
			// Здесь код, который выполнится при долгом нажатии
			if (targetElement.value) {
				console.log(e.target);
				console.log(targetElement.value);
				isLongPress.value = true;
				targetElement.value.classList.add('cards__obj-dropped');
				console.log('Долгий тап!');
			}
		}, 500); // Время задержки для долгого тапа (в миллисекундах)
	}

	function endLongPress(e: MouseEvent | TouchEvent) {
		e.preventDefault();
		if (longPressTimeout.value) {
			clearTimeout(longPressTimeout.value);
			longPressTimeout.value = null;
			isLongPress.value = false;
			targetElement.value!.classList.remove('cards__obj-dropped');
			targetElement.value = null;
		}
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
