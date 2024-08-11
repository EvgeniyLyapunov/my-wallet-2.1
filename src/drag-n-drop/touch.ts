import { useWalletStore } from '@/stores/walletStore';
import { nanoid } from 'nanoid';

export const useTouchedDragNDrop = (parentElem: HTMLElement, refreshKey: Ref<string>) => {
	const walletStore = useWalletStore();
	const parentRect = parentElem.getBoundingClientRect();
	let longPressTimeout: any;
	const draggedCardName = ref<string>('');
	const targetElement = ref<HTMLElement | null>(null);
	const isLongPress = ref<boolean>(false);
	const elemTouchX = ref<number | null>(null);
	const elemTouchY = ref<number | null>(null);

	const draggedElementIndex = ref<number | null>(null);

	const startLongPress = (e: TouchEvent, index: number, cardName: string) => {
		e.preventDefault();
		draggedCardName.value = cardName;
		targetElement.value = e.currentTarget as HTMLElement; // Сохраняем текущий элемент
		longPressTimeout = setTimeout(() => {
			if (targetElement.value) {
				isLongPress.value = true;
				draggedElementIndex.value = index;
				targetElement.value.classList.add('cards__obj-dropped');

				const elem = targetElement.value.getBoundingClientRect();

				// координаты точки тапа или клика относительно родительского элемента всего списка карт
				const startAbsX = e.touches[0].clientX - parentRect.left;
				const startAbsY = e.touches[0].clientY - parentRect.top;

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
		}, 700);
	};

	const handleMove = (e: TouchEvent, index: number) => {
		e.preventDefault();
		if (isLongPress.value && draggedElementIndex.value === index) {
			if (targetElement.value) {
				// координаты тапа в текущей итерации события move относительно родительского элемента для всех карт
				const startAbsX = e.touches[0].clientX - parentRect.left;
				const startAbsY = e.touches[0].clientY - parentRect.top;

				// случай выхода move за границы родительского элемента
				if (
					e.touches[0].clientX < parentRect.left ||
					e.touches[0].clientX > parentRect.right ||
					e.touches[0].clientY < parentRect.top ||
					e.touches[0].clientY > parentRect.bottom
				) {
					return;
				}

				// текущая позиция перемещаемой	карты относительно родителя
				const absPosElemX = startAbsX - elemTouchX.value!;
				const absPosElemY = startAbsY - elemTouchY.value!;

				targetElement.value.style.top = `${absPosElemY}px`;
				targetElement.value.style.left = `${absPosElemX}px`;
			}
		}
	};

	const endLongPress = (e: TouchEvent) => {
		e.preventDefault();

		// случай когда нажатие переходит в клик а не в удержание
		if (isLongPress.value === false) {
			clearTimeout(longPressTimeout!);
			longPressTimeout = null;
			isLongPress.value = false;
			return;
		}

		let newPlaceIndex: number;
		let endX: number;
		let endY: number;
		const cardsPlacesList: NodeListOf<Element> = parentElem.querySelectorAll('.cards__area-place');

		// определение координат места выхода move за пределы родителя для получения index места для карты
		// или координат того места внутри родителя где закончился move
		if (
			e.changedTouches[0].clientX < parentRect.left ||
			e.changedTouches[0].clientX > parentRect.right ||
			e.changedTouches[0].clientY < parentRect.top ||
			e.changedTouches[0].clientY > parentRect.bottom
		) {
			if (e.changedTouches[0].clientX < parentRect.left) {
				endX = parentRect.left + 1;
				endY = e.changedTouches[0].clientY;
			} else if (e.changedTouches[0].clientX > parentRect.right) {
				endX = parentRect.right - 1;
				endY = e.changedTouches[0].clientY;
			}

			if (e.changedTouches[0].clientY < parentRect.top) {
				endY = parentRect.top + 1;
				endX = e.changedTouches[0].clientX;
			} else if (e.changedTouches[0].clientY > parentRect.bottom) {
				endY = parentRect.bottom - 1;
				endX = e.changedTouches[0].clientX;
			}
		} else {
			endX = e.changedTouches[0].clientX;
			endY = e.changedTouches[0].clientY;
		}

		// получение индекса места для карты, куда нужно вписать перемещаемую карту
		// TODO: вот здесь itemRect во втором разе все значения 0, пока не разобрался почему
		cardsPlacesList.forEach((item) => {
			const itemRect = item.getBoundingClientRect();
			if (
				itemRect.top <= endY &&
				itemRect.right >= endX &&
				itemRect.bottom >= endY &&
				itemRect.left <= endX
			) {
				newPlaceIndex = +(item as HTMLElement).dataset.place!;
			}
		});

		// проверка того, что выбранное место свободно
		const card = walletStore.getCard_ByName(draggedCardName.value);

		newPlaceIndex = walletStore.checkAndGetEmptyPlaceForMoveCard(
			newPlaceIndex!,
			draggedCardName.value
		);
		if (newPlaceIndex > -1) {
			card!.screenLocation = newPlaceIndex!;
			walletStore.moveCardOnView(card!);
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

	return {
		startLongPress,
		handleMove,
		endLongPress,
	};
};
