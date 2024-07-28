<template>
	<div class="new-card">
		<div class="new-card__title-block">
			<h1 class="new-card__title">New Card</h1>
			<v-breadcrumbs class="new-card__under-title" :items="items"></v-breadcrumbs>
		</div>
		<v-form class="new-card__form form" ref="form">
			<v-text-field
				v-model="name"
				:rules="nameRules"
				style="color: #fff"
				class="pb-4"
				variant="outlined"
				label="Name Of A New Card"
			></v-text-field>
			<v-select
				v-model="selectType"
				:items="selectTypeItems"
				:rules="selectTypeRules"
				style="color: #fff"
				class="pb-4"
				variant="outlined"
				label="Select Type Of Money"
			></v-select>
			<v-select
				v-model="selectBase"
				:items="selectBaseItems"
				:rules="selectBaseRules"
				style="color: #fff"
				class="pb-4"
				variant="outlined"
				label="Select A Base Card"
			></v-select>
			<v-text-field
				type="number"
				v-model="startAmount"
				:rules="startAmountRules"
				style="color: #fff"
				class="pb-4"
				variant="outlined"
				label="Start Amount"
			></v-text-field>
		</v-form>
		<div class="new-card__btn-block">
			<v-btn
				class="new-card__base-btn new-card__next-btn"
				width="90"
				density="compact"
				color="green-accent-3"
				@click="submit"
				>Create</v-btn
			>
			<v-btn
				class="new-card__base-btn new-card__clear-btn"
				width="90"
				density="compact"
				@click="handleReset"
				>Clear</v-btn
			>
			<v-btn
				class="new-card__base-btn new-card__cancel-btn"
				width="90"
				density="compact"
				color="blue-lighten-3"
				@click="handleCancel"
				>Cancel</v-btn
			>
		</div>
	</div>
</template>

<script setup lang="ts">
	import Card from '@/models/Card';
	import { useWalletStore } from '@/stores/walletStore';
	import type { TCardMoney } from '@/models/types/cardTypes';
	import moment from 'moment';
	import bankIcon from '@/assets/images/icons/bank-card.png';
	import cashIcon from '@/assets/images/icons/cash.png';

	definePage({
		name: 'newCard_view',
		path: '/new-card-view',
	});

	const router = useRouter();
	const walletStore = useWalletStore();

	let newCard: Card;

	const form = ref();
	const name = ref<string>('');
	const nameRules = [
		(value: string) => {
			if (value?.length > 1) return true;
			return 'Длина имени карты от 2 до 30 символов.';
		},
		(value: string) => {
			if (walletStore.checkNewCardName(value)) return true;
			return 'Карта с таким именем уже существует.';
		},
	];

	const selectType = ref<TCardMoney>();
	const selectTypeItems = ref<string[]>(['cash', 'bank']);
	const selectTypeRules = [
		(value: string) => {
			if (value) return true;
			return 'Тип карты - наличные или безнал.';
		},
	];

	const selectBase = ref<string>('');
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
		}
	});

	const selectBaseRules = [
		(value: string) => {
			if (value) return true;
			return 'Если карта базовая, выберите пункт "base"';
		},
	];

	const startAmount = ref<number>(0);
	const startAmountRules = [
		(value: number) => {
			if (value >= 0) return true;
			return 'Начальная сумма равна или больше 0';
		},
	];

	onMounted(() => {
		newCard = reactive<Card>(new Card());
		selectBaseItems.value = ['base'];
	});

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
			title: 'New card',
			disabled: true,
			href: '/new-card-view',
		},
	];

	const handleCancel = () => {
		window.history.length > 1 ? router.go(-1) : router.push('/');
	};

	const handleReset = () => {
		form.value.reset();
	};

	async function validate() {
		const { valid } = await form.value.validate();
		return valid;
	}

	const submit = async () => {
		const isFormValid = await validate();

		if (!isFormValid) {
			return;
		}

		newCard.cardName = name.value;
		newCard.cardMoneyType = selectType.value!;

		if (newCard.cardMoneyType === 'bank') {
			newCard.cardIcon = bankIcon;
		} else {
			newCard.cardIcon = cashIcon;
		}

		newCard.baseCardName = selectBase.value;

		if (newCard.baseCardName !== 'base') {
			newCard.baseCardId = walletStore.getCardId_ByName(newCard.baseCardName);
			newCard.isVirtual = true;
			walletStore.setId_ToVirtualListBaseCard(newCard.cardId, newCard.baseCardId);
		}

		newCard.currentSum = startAmount.value;

		walletStore.addCard_ToList(JSON.parse(JSON.stringify(newCard)));

		// console.log(moment(newCard.changesLastDate).format('DD_MMMM_YYYY - HH.mm'));

		newCard = new Card();

		router.push('/cards-view');
	};
</script>

<style scoped lang="scss">
	@import './new-card.scss';
</style>
