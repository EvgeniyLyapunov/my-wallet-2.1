<template>
	<div>
		<v-dialog v-model="isShow" :persistent="true">
			<v-card class="modal">
				<v-card-title>
					<h2 class="modal__title">Change card balance</h2>
				</v-card-title>
				<v-card-text class="modal__form">
					<div class="modal__form-balance-info">
						<span class="modal__form-balance-info-sum">{{
							new Intl.NumberFormat('ru', {
								style: 'currency',
								currency: 'RUB',
								minimumFractionDigits: 0,
							}).format(props.card!.currentSum)
						}}</span>
					</div>
					<div
						:class="{
							'modal__form-input': !isFocus_InputAmountField,
							'modal__form-input_focus': isFocus_InputAmountField,
						}"
					>
						<span>{{ inputAmount }}</span>
					</div>
					<div class="modal__form-actions mb-5">
						<v-btn class="modal__form-actions-btn">
							<v-icon>mdi-minus-thick</v-icon>
						</v-btn>
						<v-btn class="modal__form-actions-btn modal__form-actions-btn_balance"
							>Change Balance</v-btn
						>
						<v-btn class="modal__form-actions-btn">
							<v-icon>mdi-plus-thick</v-icon>
						</v-btn>
					</div>
					<div class="modal__form-keyboard">
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
				</v-card-text>
				<div class="modal__footer">
					<div class="modal__footer-btns">
						<v-btn class="modal__footer-btn" @click="onCloseModal">Cancel</v-btn>
					</div>
				</div>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup lang="ts">
	import Card from '@/models/Card';
	import { useWalletStore } from '@/stores/walletStore';

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

	const inputAmount = ref<string>('0');
	const isFocus_InputAmountField = computed<boolean>(() => {
		return inputAmount.value === '0' ? false : true;
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

	const onCloseModal = () => {
		inputAmount.value = '0';
		emit('update:modelValue', false);
	};
</script>

<style scoped lang="scss">
	@import './change-balance-modal.scss';
</style>
