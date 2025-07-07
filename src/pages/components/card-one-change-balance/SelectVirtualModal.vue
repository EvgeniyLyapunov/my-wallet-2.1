<template>
	<div>
		<v-dialog v-model="isShow" :persistent="true">
			<v-card class="modal">
				<v-card-title>
					<h2 class="modal__title">Выбор виртуальной карты</h2>
				</v-card-title>
				<v-card-text class="modal__form form">
					<section class="form__descr">
						<p class="form__descr-info">
							Вы хотите установить новый баланс этой карты равный
							{{ props.amountForChange }} руб.
						</p>
						<p class="form__descr-info">{{ descrMessage }}</p>
						<p class="form__descr-label">Выберите виртуальную карту для изменения её баланса:</p>
					</section>
					<section class="form__radio">
						<VRadioGroup v-model="radioSelectedVirtual">
							<VRadio
								v-for="item in virtualCards"
								:label="item.cardName + ' - ' + item.currentSum"
								:value="item.cardId"
							></VRadio>
						</VRadioGroup>
					</section>
					<section v-if="virtualCard" class="form__resume">
						<p class="form__resume-text">
							Новый баланс {{ props.card!.cardName }} карты будет {{ props.amountForChange }} руб.
						</p>
						<p class="form__resume-text">
							Баланс {{ virtualCard!.cardName }} виртуальной карты будет изменён и составит
							{{ newVirtualSum }} руб.
						</p>
						<p class="form__resume-text">
							Если значение отрицательное у {{ virtualCard!.cardName }} виртуальной карты,
							скорректируйте его вручную.
						</p>
					</section>
					<div v-else class="form__resume-empty"></div>
					<section class="form__btns btns">
						<v-btn class="btns__button" :disabled="!virtualCard" @click="onOk">Ok</v-btn>
						<v-btn class="btns__button" @click="onCloseModal">Отмена</v-btn>
					</section>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup lang="ts">
	import type { ICard } from '@/models/types/cardTypes';
	import { useWalletStore } from '@/stores/walletStore';
	import { useCardService } from '@/services/cardService';
	const emit = defineEmits<{
		'update:modelValue': [type: boolean];
		makeChangeBalance: [type: void];
	}>();

	const props = defineProps<{
		modelValue: boolean;
		card: ICard;
		amountForChange: number;
	}>();

	const isShow = computed({
		get() {
			return props.modelValue;
		},
		set(value) {
			emit('update:modelValue', value);
		},
	});

	const { getVirtualCards_ByBaseCardId, getSum_AllVirtualCardsOfBaseCard } = useWalletStore();
	const { cardOperationBalance_ChangeBalance } = useCardService();

	const descrMessage = ref<string>('');
	const virtualCards = ref<ICard[]>([]);
	const sumOfAllVirtual = ref<number>(0);
	const newVirtualSum = ref<number>(0);

	watch(
		() => isShow.value,
		(newValue, oldValue) => {
			if (newValue) {
				virtualCards.value = getVirtualCards_ByBaseCardId(props.card!.cardId);
				sumOfAllVirtual.value = getSum_AllVirtualCardsOfBaseCard(props.card!)!;
				descrMessage.value = `Сумма виртуальных карт этой карты ${sumOfAllVirtual.value!} руб. Минимально допустимая сумма баланса ${sumOfAllVirtual.value!} руб.`;
			}
		}
	);

	const radioSelectedVirtual = ref<string>('');
	const virtualCard = ref<ICard | undefined>();

	watch(
		() => radioSelectedVirtual.value,
		(newValue) => {
			if (newValue) {
				virtualCard.value = virtualCards.value.find((item) => item.cardId === newValue);

				const gap = props.card.currentSum - props.amountForChange;
				newVirtualSum.value = virtualCard.value!.currentSum - gap;
			}
		}
	);

	const onCloseModal = () => {
		radioSelectedVirtual.value = '';
		virtualCard.value = undefined;
		descrMessage.value = ' ';
		virtualCards.value = [];
		sumOfAllVirtual.value = 0;
		newVirtualSum.value = 0;
		emit('update:modelValue', false);
	};

	const onOk = () => {
		cardOperationBalance_ChangeBalance(props.card, props.amountForChange);
		cardOperationBalance_ChangeBalance(virtualCard.value!, newVirtualSum.value!);
		emit('makeChangeBalance');
		onCloseModal();
	};
</script>

<style scoped lang="scss">
	@import './select-virtual-modal.scss';
</style>
