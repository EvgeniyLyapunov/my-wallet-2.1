<template>
	<div class="cards">
		<div class="cards__title-block">
			<h1 class="cards__title">Cards</h1>
			<div class="cards__breadcrumbs breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Home</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__link" @click="onRouteWallet">Wallet</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">Cards</span>
			</div>
		</div>
		<div :key="refreshKey" ref="cardsArea" class="cards__area">
			<div
				v-for="(obj, i) in cardsViewStore.сardsPlacesList"
				:key="i"
				class="cards__area-place"
				:data-place="i"
			>
				<CardObjectComponent
					v-if="obj !== 'empty'"
					:card-name="getCardObjName(obj)"
					:card-icon="getCardIcon(obj)"
					:data-cardname="obj"
					@mousedown="($event) => startLongPress($event, i, obj)"
					@touchstart="($event) => startLongPress($event, i, obj)"
					@mousemove="($event) => handleMove($event, i)"
					@touchmove="($event) => handleMove($event, i)"
					@touchend="($event) => endLongPress($event, obj)"
					@mouseup="($event) => endLongPress($event, obj)"
				/>
			</div>
			<div :class="cardNameСlassObject">{{ showCardName }}</div>
		</div>
		<v-spacer></v-spacer>
		<div class="cards__btns">
			<v-btn density="default" width="120" variant="elevated" @click="handleGoHome"> Home</v-btn>
			<v-btn density="default" width="120" variant="elevated" @click="handleToNewCardPage"
				>New Card</v-btn
			>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { ICard } from '@/models/types/cardTypes';
	import { nanoid } from 'nanoid';
	import { useWalletStore } from '@/stores/walletStore';
	import { useCardsViewStore } from '@/stores/cardsViewStore';
	import CardObjectComponent from '@/pages/components/cards-view/CardObjectComponent.vue';

	definePage({
		name: 'cards_view',
		path: '/cards-view',
	});

	const router = useRouter();
	const walletStore = useWalletStore();
	const cardsViewStore = useCardsViewStore();

	const cardsArea = ref();
	const refreshKey = ref<string>(nanoid());
	const parentRect = ref<DOMRect>();

	const showCardName = ref<string | undefined>();
	const cardNameСlassObject = computed(() => ({
		'cards__area-card-name': true, // Этот класс всегда применяется
		'cards__area-card-name_show': showCardName.value, // Этот класс применяется в зависимости от isActive
	}));

	// const longPressTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
	let longPressTimeout: any;
	const draggedCardName = ref<string>('');
	const targetElement = ref<HTMLElement | null>(null); // Состояние для хранения целевого элемента
	const isLongPress = ref<boolean>(false);
	const elemTouchX = ref<number | null>(null);
	const elemTouchY = ref<number | null>(null);

	const draggedElementIndex = ref<number | null>(null);

	onMounted(() => {
		parentRect.value = cardsArea.value.getBoundingClientRect();
	});

	const breadcrumbsDivider: string = '/';

	const onRouteHome = () => {
		router.push('/');
	};

	const onRouteWallet = () => {
		router.push('/wallet-view');
	};

	const getCardObjName = (cardName: string) => {
		if (cardName.length <= 10) return cardName;

		const cardObjName = cardName.substring(0, 10) + '...';
		return cardObjName;
	};

	function getCardIcon(cardName: string) {
		if (cardName === 'empty') return 'empty';

		const iconPath = walletStore.cardList.find((item) => item.cardName === cardName)!.cardIcon!;

		return iconPath;
	}

	const openCard = (e: MouseEvent | TouchEvent, cardName: string) => {
		e.preventDefault();
		const cardId = walletStore.getCardId_ByName(cardName);
		router.push(`/card-one-view/${cardId}`);
	};

	const startLongPress = (e: MouseEvent | TouchEvent, index: number, cardName: string) => {
		e.preventDefault();

		draggedCardName.value = cardName;
		targetElement.value = e.currentTarget as HTMLElement; // Сохраняем текущий элемент
		longPressTimeout = setTimeout(() => {
			if (e instanceof TouchEvent) {
				if (targetElement.value) {
					showCardName.value = cardName;

					isLongPress.value = true;
					draggedElementIndex.value = index;
					targetElement.value.classList.add('cards__obj-dropped');

					const elem = targetElement.value.getBoundingClientRect();

					// координаты точки тапа или клика относительно родительского элемента всего списка карт
					const startAbsX = e.touches[0].clientX - parentRect.value!.left;
					const startAbsY = e.touches[0].clientY - parentRect.value!.top;

					// константы не меняющиеся при событии перетаскивания - координаты тапа относительно краёв карты
					elemTouchX.value = e.touches[0].clientX - elem.left;
					elemTouchY.value = e.touches[0].clientY - elem.top;

					// координаты карты внутри родителя, используются для позиционирования карты при добавлении ей position: absolute
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
					showCardName.value = cardName;

					isLongPress.value = true;
					draggedElementIndex.value = index;
					targetElement.value.classList.add('cards__obj-dropped');

					const elem = targetElement.value.getBoundingClientRect();

					const startAbsX = e.clientX - parentRect.value!.left;
					const startAbsY = e.clientY - parentRect.value!.top;

					elemTouchX.value = e.clientX - elem.left;
					elemTouchY.value = e.clientY - elem.top;

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
			}
		}, 700); // Время задержки для долгого тапа (в миллисекундах)
	};

	const handleMove = (e: MouseEvent | TouchEvent, index: number) => {
		e.preventDefault();

		let shadowPlaceIndex: number;
		const cardsPlacesList: HTMLElement[] = cardsArea.value.querySelectorAll('.cards__area-place');

		if (isLongPress.value && draggedElementIndex.value === index) {
			if (e instanceof TouchEvent) {
				if (targetElement.value) {
					// координаты тапа в текущей итерации события move относительно "родительского элемента для всех карт"
					const startAbsX = e.touches[0].clientX - parentRect.value!.left;
					const startAbsY = e.touches[0].clientY - parentRect.value!.top;

					// случай выхода move за границы родительского элемента
					if (
						e.touches[0].clientX < parentRect.value!.left ||
						e.touches[0].clientX > parentRect.value!.right ||
						e.touches[0].clientY < parentRect.value!.top ||
						e.touches[0].clientY > parentRect.value!.bottom
					) {
						return;
					}

					// текущая позиция перемещаемой	карты относительно родителя
					const absPosElemX = startAbsX - elemTouchX.value!;
					const absPosElemY = startAbsY - elemTouchY.value!;

					targetElement.value.style.top = `${absPosElemY}px`;
					targetElement.value.style.left = `${absPosElemX}px`;

					// отображение тени карты - то место куда она может встать если прямо сейчас закончить перемещение
					// расчитывается по координатам текущего тапа
					shadowPlaceIndex = getPositionShadow(e, startAbsX, startAbsY, cardsPlacesList);

					const checkedShadowPlaceIndex = cardsViewStore.checkPlaceForCardShadow(
						shadowPlaceIndex,
						draggedCardName.value
					);
					if (checkedShadowPlaceIndex > -1) {
						cardsPlacesList.forEach((item) => {
							if (+item.dataset.place! === checkedShadowPlaceIndex) {
								item.classList.add('cards__shadow-style');
							} else {
								item.classList.remove('cards__shadow-style');
							}
						});
					}
				}
				// if e instanceof MouseEvent
			} else {
				if (targetElement.value) {
					const startAbsX = e.clientX - parentRect.value!.left;
					const startAbsY = e.clientY - parentRect.value!.top;

					if (
						e.clientX < parentRect.value!.left ||
						e.clientX > parentRect.value!.right ||
						e.clientY < parentRect.value!.top ||
						e.clientY > parentRect.value!.bottom
					) {
						return;
					}

					const absPosElemX = startAbsX - elemTouchX.value!;
					const absPosElemY = startAbsY - elemTouchY.value!;

					targetElement.value.style.top = `${absPosElemY}px`;
					targetElement.value.style.left = `${absPosElemX}px`;

					shadowPlaceIndex = getPositionShadow(e, startAbsX, startAbsY, cardsPlacesList);

					const checkedShadowPlaceIndex = cardsViewStore.checkPlaceForCardShadow(
						shadowPlaceIndex,
						draggedCardName.value
					);
					if (checkedShadowPlaceIndex > -1) {
						cardsPlacesList.forEach((item) => {
							if (+item.dataset.place! === checkedShadowPlaceIndex) {
								item.classList.add('cards__shadow-style');
							} else {
								item.classList.remove('cards__shadow-style');
							}
						});
					}
				}
			}
		}
	};

	const endLongPress = (e: MouseEvent | TouchEvent, cardName: string) => {
		e.preventDefault();

		showCardName.value = undefined;

		// случай когда нажатие переходит в клик а не в удержание
		if (isLongPress.value === false) {
			clearTimeout(longPressTimeout!);
			longPressTimeout = null;
			isLongPress.value = false;
			openCard(e, cardName);
			return;
		}

		let newPlaceIndex: number;
		let endX: number;
		let endY: number;
		const cardsPlacesList: HTMLElement[] = cardsArea.value.querySelectorAll('.cards__area-place');

		if (e instanceof TouchEvent) {
			// определение координат места выхода move за пределы родителя для получения index места для карты
			// или координат того места внутри родителя где закончился move
			if (
				e.changedTouches[0].clientX < parentRect.value!.left ||
				e.changedTouches[0].clientX > parentRect.value!.right ||
				e.changedTouches[0].clientY < parentRect.value!.top ||
				e.changedTouches[0].clientY > parentRect.value!.bottom
			) {
				if (e.changedTouches[0].clientX < parentRect.value!.left) {
					endX = parentRect.value!.left + 1;
					endY = e.changedTouches[0].clientY;
				} else if (e.changedTouches[0].clientX > parentRect.value!.right) {
					endX = parentRect.value!.right - 1;
					endY = e.changedTouches[0].clientY;
				}

				if (e.changedTouches[0].clientY < parentRect.value!.top) {
					endY = parentRect.value!.top + 1;
					endX = e.changedTouches[0].clientX;
				} else if (e.changedTouches[0].clientY > parentRect.value!.bottom) {
					endY = parentRect.value!.bottom - 1;
					endX = e.changedTouches[0].clientX;
				}
			} else {
				endX = e.changedTouches[0].clientX;
				endY = e.changedTouches[0].clientY;
			}

			// получение индекса места для карты, куда нужно вписать перемещаемую карту
			cardsPlacesList.forEach((item) => {
				const itemRect = item.getBoundingClientRect();
				if (
					itemRect.top <= endY &&
					itemRect.right >= endX &&
					itemRect.bottom >= endY &&
					itemRect.left <= endX
				) {
					newPlaceIndex = +item.dataset.place!;
				}
			});
		} else {
			if (
				e.clientX < parentRect.value!.left ||
				e.clientX > parentRect.value!.right ||
				e.clientY < parentRect.value!.top ||
				e.clientY > parentRect.value!.bottom
			) {
				if (e.clientX < parentRect.value!.left) {
					endX = parentRect.value!.left + 1;
					endY = e.clientY;
				} else if (e.clientX > parentRect.value!.right) {
					endX = parentRect.value!.right - 1;
					endY = e.clientY;
				}

				if (e.clientY < parentRect.value!.top) {
					endY = parentRect.value!.top + 1;
					endX = e.clientX;
				} else if (e.clientY > parentRect.value!.bottom) {
					endY = parentRect.value!.bottom - 1;
					endX = e.clientX;
				}
			} else {
				endX = e.clientX;
				endY = e.clientY;
			}

			cardsPlacesList.forEach((item) => {
				const itemRect = item.getBoundingClientRect();
				if (
					itemRect.top <= endY &&
					itemRect.right >= endX &&
					itemRect.bottom >= endY &&
					itemRect.left <= endX
				) {
					newPlaceIndex = +item.dataset.place!;
				}
			});
		}

		// проверка того, что выбранное место свободно
		const card = walletStore.getCard_ByName(draggedCardName.value);

		newPlaceIndex = cardsViewStore.checkAndGetEmptyPlaceForMoveCard(
			newPlaceIndex!,
			draggedCardName.value
		);
		if (newPlaceIndex > -1) {
			card!.screenLocation = newPlaceIndex!;
			cardsViewStore.moveCardOnView(card!);
		}

		clearTimeout(longPressTimeout.value);
		longPressTimeout = null;
		isLongPress.value = false;
		targetElement.value!.classList.remove('cards__obj-dropped');
		targetElement.value = null;
		draggedCardName.value = '';
		elemTouchX.value = null;
		elemTouchY.value = null;
		refreshKey.value = nanoid();
	};

	function getPositionShadow(
		e: TouchEvent | MouseEvent,
		X: number,
		Y: number,
		cardsPlacesList: HTMLElement[]
	): number {
		let endX = X;
		let endY = Y;
		let shadowPlaceIndex = 0;

		if (e instanceof TouchEvent) {
			if (
				e.changedTouches[0].clientX < parentRect.value!.left ||
				e.changedTouches[0].clientX > parentRect.value!.right ||
				e.changedTouches[0].clientY < parentRect.value!.top ||
				e.changedTouches[0].clientY > parentRect.value!.bottom
			) {
				if (e.changedTouches[0].clientX < parentRect.value!.left) {
					endX = parentRect.value!.left + 1;
					endY = e.changedTouches[0].clientY;
				} else if (e.changedTouches[0].clientX > parentRect.value!.right) {
					endX = parentRect.value!.right - 1;
					endY = e.changedTouches[0].clientY;
				}

				if (e.changedTouches[0].clientY < parentRect.value!.top) {
					endY = parentRect.value!.top + 1;
					endX = e.changedTouches[0].clientX;
				} else if (e.changedTouches[0].clientY > parentRect.value!.bottom) {
					endY = parentRect.value!.bottom - 1;
					endX = e.changedTouches[0].clientX;
				}
			} else {
				endX = e.changedTouches[0].clientX;
				endY = e.changedTouches[0].clientY;
			}
		} else {
			if (
				e.clientX < parentRect.value!.left ||
				e.clientX > parentRect.value!.right ||
				e.clientY < parentRect.value!.top ||
				e.clientY > parentRect.value!.bottom
			) {
				if (e.clientX < parentRect.value!.left) {
					endX = parentRect.value!.left + 1;
					endY = e.clientY;
				} else if (e.clientX > parentRect.value!.right) {
					endX = parentRect.value!.right - 1;
					endY = e.clientY;
				}

				if (e.clientY < parentRect.value!.top) {
					endY = parentRect.value!.top + 1;
					endX = e.clientX;
				} else if (e.clientY > parentRect.value!.bottom) {
					endY = parentRect.value!.bottom - 1;
					endX = e.clientX;
				}
			} else {
				endX = e.clientX;
				endY = e.clientY;
			}
		}

		cardsPlacesList.forEach((item) => {
			const itemRect = item.getBoundingClientRect();
			if (
				itemRect.top <= endY &&
				itemRect.right >= endX &&
				itemRect.bottom >= endY &&
				itemRect.left <= endX
			) {
				shadowPlaceIndex = +item.dataset.place!;
			}
		});

		return shadowPlaceIndex;
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
