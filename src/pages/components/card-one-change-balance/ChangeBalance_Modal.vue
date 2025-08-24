<template>
	<div>
		<v-dialog v-model="isShow" :persistent="true">
			<v-card class="modal">
				<v-card-title>
					<h2 class="modal__title">Изменить баланс карты</h2>
				</v-card-title>
				<v-card-text class="modal__form">
					<!-- Отображение текущей суммы карты -->

					<div class="modal__form-balance-info">
						<span class="modal__form-balance-info-sum">{{
							new Intl.NumberFormat('ru', {
								style: 'currency',
								currency: 'RUB',
								minimumFractionDigits: 0,
							}).format(props.card!.currentSum)
						}}</span>
					</div>

					<!-- Отображение введённой суммы -->

					<div
						:class="{
							'modal__form-input': !isFocus_InputAmountField,
							'modal__form-input_focus': isFocus_InputAmountField,
						}"
					>
						<span>{{ inputAmount }}</span>
					</div>

					<!-- Кнопки изменения баланса -->

					<div class="modal__form-actions mb-5">
						<v-btn class="modal__form-actions-btn" @click="onBalanceMinus">
							<v-icon>mdi-minus-thick</v-icon>
						</v-btn>
						<v-btn
							class="modal__form-actions-btn modal__form-actions-btn_balance"
							@click="onChangeBalance"
						>
							<v-icon>mdi-swap-horizontal-bold</v-icon>
						</v-btn>
						<v-btn class="modal__form-actions-btn" @click="onBalancePlus">
							<v-icon>mdi-plus-thick</v-icon>
						</v-btn>
					</div>

					<!-- клавиатура ввода суммы -->

					<div class="modal__form-keyboard-wrapper">
						<div
							:class="{
								'modal__form-keyboard': true,
								'modal__form-keyboard_active': isVisible_Keyboard,
							}"
						>
							<div class="modal__form-keyboard-line mb-3">
								<v-btn class="modal__form-keyboard-btn" @click="onNumberKeyPress('1')">1</v-btn>
								<v-btn class="modal__form-keyboard-btn mr-3 ml-3" @click="onNumberKeyPress('2')"
									>2</v-btn
								>
								<v-btn class="modal__form-keyboard-btn" @click="onNumberKeyPress('3')"> 3</v-btn>
							</div>
							<div class="modal__form-keyboard-line mb-3">
								<v-btn class="modal__form-keyboard-btn" @click="onNumberKeyPress('4')">4</v-btn>
								<v-btn class="modal__form-keyboard-btn mr-3 ml-3" @click="onNumberKeyPress('5')"
									>5</v-btn
								>
								<v-btn class="modal__form-keyboard-btn" @click="onNumberKeyPress('6')">6</v-btn>
							</div>
							<div class="modal__form-keyboard-line mb-3">
								<v-btn class="modal__form-keyboard-btn" @click="onNumberKeyPress('7')">7</v-btn>
								<v-btn class="modal__form-keyboard-btn mr-3 ml-3" @click="onNumberKeyPress('8')"
									>8</v-btn
								>
								<v-btn class="modal__form-keyboard-btn" @click="onNumberKeyPress('9')">9</v-btn>
							</div>
							<div class="modal__form-keyboard-line mb-3">
								<v-btn class="modal__form-keyboard-btn" @click="onNumberKeyPress('0')">0</v-btn>
								<v-btn class="modal__form-keyboard-btn mr-3 ml-3" @click="onLastNumberDelete">
									<v-icon>mdi-arrow-left-bold-outline</v-icon>
								</v-btn>
								<v-btn class="modal__form-keyboard-btn" @click="onResetInputAmount">C</v-btn>
							</div>
						</div>
						<v-btn
							v-if="!isVisible_Keyboard"
							class="modal__form-keyboard-show"
							icon="mdi-keyboard"
							@click="onKeyboardShow"
						>
						</v-btn>
						<v-btn
							v-if="isVisible_Keyboard"
							class="modal__form-keyboard-show"
							icon="mdi-keyboard-off"
							@click="onKeyboardShow"
						>
						</v-btn>
					</div>

					<!-- Выбор тега -->

					<div class="modal__form-tags-wrapper">
						<div :class="{ 'modal__form-tags': true, 'modal__form-tags_active': isVisible_Tags }">
							<v-btn
								class="modal__form-tags_edit"
								icon="mdi-pencil"
								variant="text"
								@click="onTagEditModalShow"
							></v-btn>
							<TagItem v-for="tag in tagsList" :key="tag.Id" :tag="tag" :mode="'Operation'" />
						</div>
						<v-btn
							v-if="!isVisible_Tags"
							class="modal__form-tags-show"
							icon="mdi-tag"
							@click="onTagsShow"
						>
						</v-btn>
						<v-btn
							v-if="isVisible_Tags"
							class="modal__form-tags-show_open"
							icon="mdi-tag-off"
							@click="onTagsShow"
						>
						</v-btn>
					</div>
				</v-card-text>
				<div class="modal__footer">
					<div class="modal__footer-btns">
						<v-btn class="modal__footer-btn" @click="onCloseModal">Отмена</v-btn>
					</div>
				</div>
			</v-card>
		</v-dialog>
	</div>

	<TagEditModal v-model="isVisidle_TagEditModal" />
	<MessageBox
		v-model="isVisible_MessageBox"
		:title="messageBox_Title"
		:message="messageBox_Message"
	/>

	<SelectVirtualModal
		v-model="isVisible_SelectVirtualModal"
		:card="props.card!"
		:amountForChange="amountForChange"
		@makeChangeBalance="changeBalanceWithVirtualCard"
	/>

	<Confirm
		v-model="isConfirmVisible"
		:confirm-action="'Подтвердите ваши действия!'"
		@confirm="onConfirmChangeBalance"
	/>
</template>

<script setup lang="ts">
	import type { ICard, IOperation, ITag } from '@/models/types/cardTypes';
	import TagItem from '@/pages/components/card-one-change-balance/TagItem.vue';
	import { useWalletStore } from '@/stores/walletStore';
	import { useTagsStore } from '@/stores/tagsStore';
	import { useOperationsStore } from '@/stores/operationsStore';
	import TagEditModal from '@/pages/components/card-one-change-balance/TagEdit_Modal.vue';
	import MessageBox from '@/pages/components/confirms/MessageBox.vue';
	import Confirm from '@/pages/components/confirms/Confirm.vue';
	import SelectVirtualModal from './SelectVirtualModal.vue';
	import moment from 'moment-timezone';

	const emit = defineEmits<{
		'update:modelValue': [type: boolean];
		cardPlus: [type: number];
		cardMinus: [type: number];
		cardChangeBalance: [type: number];
	}>();

	const props = defineProps<{
		modelValue: boolean;
		card: ICard | undefined;
	}>();

	const isShow = computed({
		get() {
			return props.modelValue;
		},
		set(value) {
			emit('update:modelValue', value);
		},
	});

	const walletStore = useWalletStore();
	const tagsStore = useTagsStore();
	const operationsStore = useOperationsStore();
	const tagsList = ref<ITag[]>([]);
	const tagsForCurrentOperation = ref<ITag[]>([]);

	watch(
		() => props.modelValue,
		(newValue) => {
			if (newValue) {
				operationsStore.reset_CurrentSelectedTag();
				operationsStore.set_IsCurrentSelectedExclusionTag(false);
				tagsList.value = tagsStore.get_TagsList();
			}
		}
	);

	const inputAmount = ref<string>('0');
	const isFocus_InputAmountField = computed<boolean>(() => {
		return inputAmount.value === '0' ? false : true;
	});

	const isVisible_Keyboard = ref<boolean>(false);
	const onKeyboardShow = () => {
		if (!isVisible_Keyboard.value) {
			isVisible_Keyboard.value = !isVisible_Keyboard.value;
			isVisible_Tags.value = false;
		} else {
			isVisible_Keyboard.value = !isVisible_Keyboard.value;
		}
	};

	const isVisible_Tags = ref<boolean>(true);
	const onTagsShow = () => {
		if (!isVisible_Tags.value) {
			isVisible_Tags.value = !isVisible_Tags.value;
			isVisible_Keyboard.value = false;
		} else {
			isVisible_Tags.value = !isVisible_Tags.value;
		}
	};

	const isVisidle_TagEditModal = ref<boolean>(false);

	const onTagEditModalShow = () => {
		isVisidle_TagEditModal.value = true;
	};

	watch(isVisidle_TagEditModal, (newValue) => {
		if (!newValue) {
			tagsList.value = tagsStore.get_TagsList();
		}
	});

	const onNumberKeyPress = (keyNumber: string) => {
		if (inputAmount.value === '0' && keyNumber === '0') {
			return;
		}

		if (inputAmount.value === '0') {
			inputAmount.value = keyNumber;
			return;
		}

		inputAmount.value = inputAmount.value + keyNumber;
	};

	const onLastNumberDelete = () => {
		if (inputAmount.value === '0') {
			return;
		}

		if (inputAmount.value.length === 1) {
			inputAmount.value = '0';
			return;
		}

		inputAmount.value = inputAmount.value.slice(0, inputAmount.value.length - 1);
	};

	const onResetInputAmount = () => {
		inputAmount.value = '0';
	};

	const isVisible_MessageBox = ref<boolean>(false);
	const messageBox_Title = ref<string>('');
	const messageBox_Message = ref<string>('');

	const isVisible_SelectVirtualModal = ref<boolean>(false);
	const amountForChange = ref<number>(0);

	const changeBalanceWithVirtualCard = () => {
		onCloseModal();
	};

	// change balance

	const onBalancePlus = () => {
		if (inputAmount.value === '0') {
			return;
		}

		const amount = Number(inputAmount.value);

		if (props.card!.isVirtual) {
			const baseCard = walletStore.getCard_ById(props.card!.baseCardId!);
			const sumOfAllVirtual = walletStore.getSum_AllVirtualCardsOfBaseCard(baseCard!);
			const gap = baseCard!.currentSum - sumOfAllVirtual!;

			if (amount > gap) {
				isVisible_MessageBox.value = true;
				messageBox_Title.value = 'Информация!';
				messageBox_Message.value = `Сумма базовой карты позволяет увеличить баланс этой карты максимум на ${gap} руб.`;
				return;
			}
		}

		const operation: IOperation = {
			date: moment.tz('Europe/Moscow').toDate(),
			amount,
			moneyType: props.card!.cardMoneyType!,
			cardId: props.card!.cardId,
			type: 'plus',
			tag: operationsStore.get_CurrentSelectedTag()
				? operationsStore.get_CurrentSelectedTag()!.Id
				: undefined,
			exclusionTag: operationsStore.get_IsCurrentSelectedExclusionTag(),
		};

		operationsStore.addOperationToList(operation);
		if (operation.tag) {
			tagsStore.setActualTagFirst(operation.tag);
		}

		emit('cardPlus', amount);
		onCloseModal();
	};

	const onBalanceMinus = () => {
		if (inputAmount.value === '0') {
			return;
		}

		const amount = Number(inputAmount.value);
		// если карта базовая и имеет виртуальные карты
		if (!props.card!.isVirtual && props.card!.virtualList.length > 0) {
			const sumOfAllVirtual = walletStore.getSum_AllVirtualCardsOfBaseCard(props.card!);
			const gap: number = props.card!.currentSum - sumOfAllVirtual!;
			if (amount > gap) {
				isVisible_MessageBox.value = true;
				messageBox_Title.value = 'Информация!';
				messageBox_Message.value = `Баланс этой карты позволяет уменьшить сумму максимум на ${gap} руб.`;
				return;
			}
			// если карта виртуальная
		} else if (props.card!.isVirtual) {
			const baseCard = walletStore.getCard_ById(props.card!.baseCardId!);
			const sumOfAllVirtual = walletStore.getSum_AllVirtualCardsOfBaseCard(baseCard!);
			const gap = baseCard!.currentSum - sumOfAllVirtual!;
			if (amount > gap + props.card!.currentSum) {
				isVisible_MessageBox.value = true;
				messageBox_Title.value = 'Информация!';
				messageBox_Message.value = `Баланс базовой карты позволяет тебе уменьшить сумму этой карты на ${
					props.card!.currentSum
				} руб. до нуля, или до ${gap} руб. в минус.`;
				return;
			}
		}

		const operation: IOperation = {
			date: moment.tz('Europe/Moscow').toDate(),
			amount,
			moneyType: props.card!.cardMoneyType!,
			cardId: props.card!.cardId,
			type: 'minus',
			tag: operationsStore.get_CurrentSelectedTag()
				? operationsStore.get_CurrentSelectedTag()!.Id
				: undefined,
			exclusionTag: operationsStore.get_IsCurrentSelectedExclusionTag(),
		};

		operationsStore.addOperationToList(operation);
		if (operation.tag) {
			tagsStore.setActualTagFirst(operation.tag);
		}

		emit('cardMinus', amount);
		onCloseModal();
	};

	const onChangeBalance = () => {
		const amount = Number(inputAmount.value);

		// если сумма уменьшеается
		if (amount < props.card!.currentSum) {
			// если карта базовая и имеет виртуальные карты
			if (!props.card!.isVirtual && props.card!.virtualList.length > 0) {
				const sumOfAllVirtual = walletStore.getSum_AllVirtualCardsOfBaseCard(props.card!);

				if (amount < sumOfAllVirtual!) {
					amountForChange.value = amount;
					isVisible_SelectVirtualModal.value = true;
					return;
				}
			}
			// если сумма увеличивается
		} else {
			// если карта виртуальная
			if (props.card!.isVirtual) {
				const baseCard = walletStore.getCard_ById(props.card!.baseCardId!);
				const sumOfAllVirtual = walletStore.getSum_AllVirtualCardsOfBaseCard(baseCard!);
				const gap: number = baseCard!.currentSum - sumOfAllVirtual!;
				if (amount > props.card!.currentSum + gap) {
					isVisible_MessageBox.value = true;
					messageBox_Title.value = 'Info';
					messageBox_Message.value = `Баланс базовой карты позволяет увеличить сумму этой карты максимум до ${
						props.card!.currentSum + gap
					} руб.`;
					return;
				}
			}
		}

		isConfirmVisible.value = true;
	};

	const isConfirmVisible = ref<boolean>(false);

	const onConfirmChangeBalance = (confirm: boolean) => {
		if (confirm) {
			const amount = Number(inputAmount.value);
			emit('cardChangeBalance', amount);
			onCloseModal();
		}
	};

	const onCloseModal = () => {
		inputAmount.value = '0';
		isVisible_Keyboard.value = false;
		isVisible_Tags.value = true;
		tagsForCurrentOperation.value = [];
		emit('update:modelValue', false);
	};
</script>

<style scoped lang="scss">
	@import './change-balance-modal.scss';
</style>
