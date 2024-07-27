<template>
	<div class="cards">
		<div class="cards__title-block">
			<h1 class="cards__title">Cards</h1>
			<v-breadcrumbs class="cards__under-title" :items="items"></v-breadcrumbs>
		</div>
		<div ref="cardsArea" class="cards__area">
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
					@mousedown="startLongPress($event, i)"
					@mouseup="endLongPress"
					@mouseleave="endLongPress"
					@touchstart="startLongPress($event, i)"
					@touchend="endLongPress"
					@touchmove="handleMove($event, i)"
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

	const cardsArea = ref();

	const longPressTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
	const targetElement = ref<HTMLElement | null>(null); // Состояние для хранения целевого элемента
	const isLongPress = ref<boolean>(false);
	const elemTouchX = ref<number | null>(null);
	const elemTouchY = ref<number | null>(null);
	const draggedElementIndex = ref<number | null>(null);

	onMounted(() => {});

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

	function startLongPress(e: MouseEvent | TouchEvent, index: number) {
		targetElement.value = e.currentTarget as HTMLElement; // Сохраняем текущий элемент
		longPressTimeout.value = setTimeout(() => {
			if (e instanceof TouchEvent) {
				if (targetElement.value) {
					isLongPress.value = true;
					draggedElementIndex.value = index;
					targetElement.value.classList.add('cards__obj-dropped');

					const parentRect = cardsArea.value.getBoundingClientRect();
					const elem = targetElement.value.getBoundingClientRect();

					const startAbsX = e.touches[0].clientX - parentRect.left;
					const startAbsY = e.touches[0].clientY - parentRect.top;

					elemTouchX.value = e.touches[0].clientX - elem.left;
					elemTouchY.value = e.touches[0].clientY - elem.top;

					const absPosElemX = startAbsX - elemTouchX.value;
					const absPosElemY = startAbsY - elemTouchY.value;

					const width = targetElement.value.clientWidth;
					const height = targetElement.value.clientHeight;
					targetElement.value.style.width = `${width}px`;
					targetElement.value.style.height = `${height}px`;

					targetElement.value.style.position = 'absolute';
					targetElement.value.style.top = `${absPosElemY}px`;
					targetElement.value.style.left = `${absPosElemX}px`;
				}
			} else {
				if (targetElement.value) {
				}
			}
		}, 500); // Время задержки для долгого тапа (в миллисекундах)
	}

	function handleMove(e: MouseEvent | TouchEvent, index: number) {
		if (isLongPress.value && draggedElementIndex.value === index) {
			if (e instanceof TouchEvent) {
				if (targetElement.value) {
					const parentRect = cardsArea.value.getBoundingClientRect();
					const elem = targetElement.value.getBoundingClientRect();

					const startAbsX = e.touches[0].clientX - parentRect.left;
					const startAbsY = e.touches[0].clientY - parentRect.top;

					const absPosElemX = startAbsX - elemTouchX.value!;
					const absPosElemY = startAbsY - elemTouchY.value!;

					targetElement.value.style.top = `${absPosElemY}px`;
					targetElement.value.style.left = `${absPosElemX}px`;
				}
			} else {
			}
		}
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
