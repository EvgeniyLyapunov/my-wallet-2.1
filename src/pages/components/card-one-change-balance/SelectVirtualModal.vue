<template>
	<div>
		<v-dialog v-model="isShow" :persistent="true">
			<v-card class="modal">
				<v-card-title>
					<h2 class="modal__title">Select virtual for change balance</h2>
				</v-card-title>
				<v-card-text class="modal__form form">
					<section class="form__descr">
						<p class="form__descr-info">
							You want to set a new balance for this card equal to
							{{ props.amountForChange }} rubles.
						</p>
						<p class="form__descr-info">{{ descrMessage }}</p>
						<p class="form__descr-label">So choose a virtual card to reduce its balance:</p>
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
							The new balance of the {{ props.card!.cardName }} card will be
							{{ props.amountForChange }} rubles.
						</p>
						<p class="form__resume-text">
							The balance of the {{ virtualCard!.cardName }} virtual card will change and will be
							{{ newVirtualSum }} rubles.
						</p>
						<p class="form__resume-text">
							If the value is negative, adjust the {{ virtualCard!.cardName }} virtual card amount
							separately.
						</p>
					</section>
					<div v-else class="form__resume-empty"></div>
					<section class="form__btns btns">
						<v-btn class="btns__button" :disabled="!virtualCard" @click="onOk">Ok</v-btn>
						<v-btn class="btns__button" @click="onCloseModal">Cansel</v-btn>
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
				descrMessage.value = `The sum of virtual cards of this card is ${sumOfAllVirtual.value!} rubles. The minimum sum of setting a new balance is ${sumOfAllVirtual.value!} rubles`;
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
