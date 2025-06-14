<template>
	<div>
		<v-dialog v-model="isShow" :persistent="true">
			<v-card class="modal">
				<v-card-title>
					<h2 class="modal__title">Edit card information</h2>
				</v-card-title>
				<v-card-text>
					<v-form class="modal__form form" ref="form">
						<v-text-field
							v-model="name"
							:rules="nameRules"
							class="pb-4"
							variant="outlined"
							label="Name Of A New Card"
						></v-text-field>
						<v-select
							v-model="selectType"
							:items="selectTypeItems"
							:rules="selectTypeRules"
							:disabled="isSelectTypeDisabled"
							class="pb-4"
							variant="outlined"
							label="Select Type Of Money"
						></v-select>
						<v-select
							v-model="selectBase"
							:items="selectBaseItems"
							:rules="selectBaseRules"
							:disabled="isSelectBaseDisabled"
							class="pb-4"
							variant="outlined"
							label="Select A Base Card"
						></v-select>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-btn prepend-icon="mdi-check" variant="elevated" width="120" @click="onConfirmEdit">
						<template v-slot:prepend>
							<v-icon color="green"></v-icon>
						</template>
						Ok
					</v-btn>
					<v-btn prepend-icon="mdi-cancel" variant="elevated" width="120" @click="closeModal">
						<template v-slot:prepend>
							<v-icon color="yellow"></v-icon>
						</template>
						Cancel
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup lang="ts">
	import type { ICard } from '@/models/types/cardTypes';
	import { useWalletStore } from '@/stores/walletStore';
	import { useCardService } from '@/services/cardService';
	import type { TCardMoney } from '@/models/types/cardTypes';
	import bankIcon from '@/assets/images/icons/bank-card.png';
	import cashIcon from '@/assets/images/icons/cash.png';

	const emit = defineEmits<{
		'update:modelValue': [type: boolean];
		onEdit: [type: ICard];
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

	watch(
		() => props.modelValue,
		(newValue) => {
			if (newValue) {
				name.value = props.card!.cardName;
				selectType.value = props.card!.cardMoneyType;
				selectBase.value = props.card!.baseCardName!;

				if (props.card!.isVirtual) {
					isSelectTypeDisabled.value = true;
					isSelectBaseDisabled.value = true;
				}

				if (props.card!.virtualList.length > 0) {
					isSelectTypeDisabled.value = true;
					isSelectBaseDisabled.value = true;
				}
			}
		}
	);

	const walletStore = useWalletStore();
	const cardService = useCardService();

	const form = ref();
	const name = ref<string>('');
	const nameRules = [
		(value: string) => {
			if (value?.length > 1) return true;
			return 'Длина имени карты от 2 до 30 символов.';
		},
		(value: string) => {
			if (props.card!.cardName === value || walletStore.checkNewCardName(value)) return true;
			return 'Карта с таким именем уже существует.';
		},
	];

	const selectType = ref<TCardMoney>();
	const isSelectTypeDisabled = ref<boolean>(false);
	const selectTypeItems = ref<string[]>(['cash', 'bank']);
	const selectTypeRules = [
		(value: string) => {
			if (value) return true;
			return 'Тип карты - наличные или безнал.';
		},
	];

	const selectBase = ref<string>('');
	const isSelectBaseDisabled = ref<boolean>(false);
	const selectBaseItems = ref<string[]>([]);

	watch(selectType, (newValue) => {
		if (newValue) {
			if (selectBase.value !== 'base') selectBase.value = '';

			switch (newValue) {
				case 'bank':
					selectBaseItems.value = walletStore.baseCards_BankMoney_NamesList;
					break;
				case 'cash':
					selectBaseItems.value = walletStore.baseCards_CashMoney_NamesList;
					break;
			}

			selectBaseItems.value = selectBaseItems.value.filter((item) => item !== props.card!.cardName);
		}
	});

	const selectBaseRules = [
		(value: string) => {
			if (value || isSelectBaseDisabled) return true;
			return 'Если карта базовая, выберите пункт "base"';
		},
	];

	async function validate() {
		const { valid } = await form.value.validate();
		return valid;
	}

	const closeModal = () => {
		emit('update:modelValue', false);
	};

	const onConfirmEdit = async () => {
		const isFormValid = await validate();

		if (!isFormValid) {
			return;
		}

		const editedCard: ICard = JSON.parse(JSON.stringify(props.card!));
		editedCard.cardName = name.value.trim();

		if (!isSelectTypeDisabled.value) {
			editedCard.cardMoneyType = selectType.value!;

			if (editedCard.cardMoneyType === 'bank') {
				editedCard.cardIcon = bankIcon;
			} else {
				editedCard.cardIcon = cashIcon;
			}
		}

		if (!isSelectBaseDisabled.value) {
			editedCard.baseCardName = selectBase.value!;

			if (editedCard.baseCardName !== 'base') {
				editedCard.baseCardId = walletStore.getCardId_ByName(editedCard.baseCardName);
				editedCard.isVirtual = true;
				cardService.setId_ToVirtualListBaseCard(editedCard.cardId, editedCard.baseCardId);
			}
		}

		cardService.editCardInfo(editedCard);
		emit('onEdit', editedCard);
		closeModal();
	};
</script>

<style scoped lang="scss">
	@import './cardinfo-edit-modal.scss';
</style>
