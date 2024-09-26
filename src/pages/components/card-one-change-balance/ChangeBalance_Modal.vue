<template>
	<div>
		<v-dialog v-model="isShow" :persistent="true">
			<v-card class="modal">
				<v-card-title>
					<h2 class="modal__title">Change card balance</h2>
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
							Change Balance
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
						<v-btn class="modal__footer-btn" @click="onCloseModal">Cancel</v-btn>
					</div>
				</div>
			</v-card>
		</v-dialog>
	</div>

	<TagEditModal v-model="isVisidle_TagEditModal" />
</template>

<script setup lang="ts">
	import Card from '@/models/Card';
	import Tag from '@/models/Tag';
	import TagItem from '@/pages/components/card-one-change-balance/TagItem.vue';
	import { useWalletStore } from '@/stores/walletStore';
	import { useTagsStore } from '@/stores/tagsStore';
	import TagEditModal from '@/pages/components/card-one-change-balance/TagEdit_Modal.vue';
	const emit = defineEmits<{
		'update:modelValue': [type: boolean];
	}>();

	const props = defineProps<{
		modelValue: boolean;
		card: Card | undefined;
	}>();

	const isShow = computed({
		get() {
			return props.modelValue;
		},
		set(value) {
			emit('update:modelValue', value);
		},
	});

	const tagsStore = useTagsStore();
	const tagsList = ref<Tag[]>([]);

	watch(
		() => props.modelValue,
		(newValue) => {
			if (newValue) {
				tagsList.value = tagsStore.get_ChangeBalanceTagList();
			}
		}
	);

	const inputAmount = ref<string>('0');
	const isFocus_InputAmountField = computed<boolean>(() => {
		return inputAmount.value === '0' ? false : true;
	});

	const isVisible_Keyboard = ref<boolean>(true);
	const onKeyboardShow = () => {
		if (!isVisible_Keyboard.value) {
			isVisible_Keyboard.value = !isVisible_Keyboard.value;
			isVisible_Tags.value = false;
		} else {
			isVisible_Keyboard.value = !isVisible_Keyboard.value;
		}
	};

	const isVisible_Tags = ref<boolean>(false);
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
			tagsList.value = tagsStore.get_ChangeBalanceTagList();
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

	// change balance

	const onBalancePlus = () => {};

	const onBalanceMinus = () => {};

	const onChangeBalance = () => {};

	const onCloseModal = () => {
		inputAmount.value = '0';
		emit('update:modelValue', false);
	};
</script>

<style scoped lang="scss">
	@import './change-balance-modal.scss';
</style>
