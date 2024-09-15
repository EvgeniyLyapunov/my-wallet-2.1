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
					<input
						v-model="inputAmount"
						class="modal__form-input"
						type="text"
						placeholder="operation amount"
					/>
					<div class="modal__form-actions">
						<v-btn class="modal__form-actions-btn" icon="mdi-minus-thick" rounded="0"></v-btn>
						<v-btn class="modal__form-actions-btn modal__form-actions-btn_balance"
							>Change Balance</v-btn
						>
						<v-btn class="modal__form-actions-btn" icon="mdi-plus-thick" rounded="0"></v-btn>
					</div>
					<div class="modal__form-keyboard">
						<div class="modal__form-keyboard-line mb-3">
							<v-btn>1</v-btn>
							<v-btn class="mr-3 ml-3">2</v-btn>
							<v-btn>3</v-btn>
						</div>
						<div class="modal__form-keyboard-line mb-3">
							<v-btn>4</v-btn>
							<v-btn class="mr-3 ml-3">5</v-btn>
							<v-btn>6</v-btn>
						</div>
						<div class="modal__form-keyboard-line mb-3">
							<v-btn>7</v-btn>
							<v-btn class="mr-3 ml-3">8</v-btn>
							<v-btn>9</v-btn>
						</div>
						<div class="modal__form-keyboard-line modal__form-keyboard-line_last">
							<v-btn class="modal__form-keyboard-line_last-btn mr-3">0</v-btn>
							<v-btn prepend-icon="mdi-arrow-left-bold-outline" width="100"></v-btn>
						</div>
					</div>
				</v-card-text>
				<div class="modal__footer">
					<div class="modal__footer-btns">
						<v-btn class="modal__footer-btn">Cancel</v-btn>
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

	const inputAmount = ref<number | undefined>();
</script>

<style scoped lang="scss">
	@import './change-balance-modal.scss';
</style>
