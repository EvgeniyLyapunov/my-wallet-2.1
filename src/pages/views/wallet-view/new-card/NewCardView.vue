<template>
	<div class="new-card">
		<div class="new-card__title-block">
			<h1 class="new-card__title">New Card</h1>
			<div class="cards__breadcrumbs breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Home</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__link" @click="onRouteWallet">Wallet</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__link" @click="onRouteCards">Cards</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">NewCard</span>
			</div>
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
				width="110"
				density="default"
				color="green-accent-3"
				@click="submit"
				>Create</v-btn
			>
			<v-btn
				class="new-card__base-btn new-card__clear-btn"
				width="110"
				density="default"
				@click="handleReset"
				>Clear</v-btn
			>
			<v-btn
				class="new-card__base-btn new-card__cancel-btn"
				width="110"
				density="default"
				color="blue-lighten-3"
				@click="handleCancel"
				>Cancel</v-btn
			>
		</div>
	</div>
</template>

<script setup lang="ts">
	import moment from 'moment-timezone';
	import { nanoid } from 'nanoid';
	import type { ICard } from '@/models/types/cardTypes';
	import { useWalletStore } from '@/stores/walletStore';
	import { useCardService } from '@/services/cardService';
	import type { TCardMoney } from '@/models/types/cardTypes';
	import bankIcon from '@/assets/images/icons/bank-card.png';
	import cashIcon from '@/assets/images/icons/cash.png';

	definePage({
		name: 'newCard_view',
		path: '/new-card-view',
	});

	const router = useRouter();
	const walletStore = useWalletStore();
	const cardService = useCardService();

	const newCard = ref<ICard | null>({
		baseCardId: '',
		cardId: '',
		cardName: '',
		isVirtual: false,
		baseCardName: null,
		virtualList: [],
		currentSum: 0,
		screenLocation: 0,
		changesLastDate: moment.tz('Europe/Moscow').format('DD-MM-YYYY HH:mm'),
	});

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
		selectBaseItems.value = ['base'];
	});

	const breadcrumbsDivider: string = '/';

	const onRouteHome = () => {
		router.push('/');
	};

	const onRouteWallet = () => {
		router.push('/wallet-view');
	};

	const onRouteCards = () => {
		router.push('/cards-view');
	};

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

		newCard.value!.cardId = nanoid();
		newCard.value!.cardName = name.value;
		newCard.value!.cardMoneyType = selectType.value!;

		if (newCard.value!.cardMoneyType === 'bank') {
			newCard.value!.cardIcon = bankIcon;
		} else {
			newCard.value!.cardIcon = cashIcon;
		}

		newCard.value!.baseCardName = selectBase.value;

		if (newCard.value!.baseCardName !== 'base') {
			newCard.value!.baseCardId = walletStore.getCardId_ByName(newCard.value!.baseCardName);
			newCard.value!.isVirtual = true;
			cardService.setId_ToVirtualListBaseCard(newCard.value!.cardId, newCard.value!.baseCardId);
		} else {
			newCard.value!.isVirtual = false;
		}

		newCard.value!.currentSum = Number(startAmount.value);

		walletStore.addCard_ToList(JSON.parse(JSON.stringify(newCard.value)));

		newCard.value = null;

		router.push('/cards-view');
	};
</script>

<style scoped lang="scss">
	@import './new-card.scss';
</style>
