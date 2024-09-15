<template>
	<div class="card">
		<div class="card__title-block">
			<h1 class="card__title">{{ card?.cardName }}</h1>
			<div class="cards__breadcrumbs breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Home</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__link" @click="onRouteWallet">Wallet</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__link" @click="onRouteCards">Cards</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">{{ card ? card.cardName : 'card' }}</span>
			</div>
		</div>

		<div class="card__main" :style="{ height: `${cardHeight}px` }">
			<div class="card__main-sum">
				{{
					new Intl.NumberFormat('ru', {
						style: 'currency',
						currency: 'RUB',
						minimumFractionDigits: 0,
					}).format(card!.currentSum)
				}}
			</div>

			<div class="card__main-info">
				<div class="card__main-info-block">
					<span class="card__main-info-label">Date of last modification:</span>
					<span class="card__main-info-value">{{
						moment(card!.changesLastDate).format('DD.MM.YYYY HH:mm')
					}}</span>
				</div>
				<div class="card__main-info-block">
					<span class="card__main-info-label">Type of money on the card:</span>
					<span class="card__main-info-value">{{ card!.cardMoneyType }}</span>
				</div>
				<div class="card__main-info-block">
					<span class="card__main-info-label">Type of the card:</span>
					<span class="card__main-info-value"
						>{{ !card!.isVirtual ? 'Base card' : 'Virtual card of ' }}
						<span v-if="card!.isVirtual" class="card__main-info-value_virtual">{{
							card!.baseCardName
						}}</span>
					</span>
				</div>
			</div>

			<div class="card__main-info-btns">
				<v-btn density="comfortable" class="delete" @click="onConfirmDelete">Delete card</v-btn>
				<v-btn density="comfortable" @click="onEditCardModalOpen">Edit card</v-btn>
			</div>

			<div class="card__main-balance-btn">
				<v-btn
					density="default"
					rounded="lg"
					elevation="16"
					prepend-icon="mdi-swap-horizontal-bold"
					@click="onShow_ChangeBalanceModal"
				>
					<template v-slot:prepend>
						<v-icon color="primary"></v-icon>
					</template>
					Change balance</v-btn
				>
			</div>
		</div>

		<div class="card__footer">
			<v-btn density="comfortable" prepend-icon="mdi-home" @click="goHome">
				<template v-slot:prepend>
					<v-icon color="green"></v-icon>
				</template>
				Home
			</v-btn>
			<v-btn density="comfortable" prepend-icon="mdi-cancel" @click="doCancel">
				<template v-slot:prepend>
					<v-icon color="yellow"></v-icon>
				</template>
				Cancel
			</v-btn>
		</div>
	</div>

	<CardInfo_EditModal v-model="isVisible_EditInfoModal" :card="card" @onEdit="onEditCardInfo" />>
	<MessageBox v-model="isVisibleMessageBox" :title="messageBoxTitle" :message="messageBoxMessage" />
	<Confirm
		v-model="isVisible_ConfirmModal"
		:confirm-action="confirmAction"
		:confirm-info="confirmInfo"
		@confirm="deleteCard"
	/>
	<ChangeBalanceModal v-model="isVisible_ChangeBalanceModal" :card="card" />
</template>

<script setup lang="ts">
	import moment from 'moment';
	import { useRoute } from 'vue-router';
	import Card from '@/models/Card';
	import { nanoid } from 'nanoid';
	import { useWalletStore } from '@/stores/walletStore';
	import { elementHeight_Relative_PreviousSiblingAndWindowHeight } from '@/utils/elementHeight';

	import Confirm from '@/pages/components/confirms/Confirm.vue';
	import CardInfo_EditModal from '@/pages/components/cards-one-edit-cardinfo/CardInfo_EditModal.vue';
	import MessageBox from '@/pages/components/confirms/MessageBox.vue';
	import ChangeBalanceModal from '@/pages/components/card-one-change-balance/ChangeBalance_Modal.vue';

	type RequestCardIdParam = {
		id: string;
	};

	definePage({
		name: 'card-one_view',
		path: '/card-one-view/:id',
	});

	const walletStore = useWalletStore();
	const cardHeight = ref<number>(0);

	const isVisibleMessageBox = ref<boolean>(false);
	const messageBoxTitle = ref<string>('');
	const messageBoxMessage = ref<string>('');

	const isVisible_EditInfoModal = ref<boolean>(false);

	const isVisible_ConfirmModal = ref<boolean>(false);
	const confirmAction = ref<string>('');
	const confirmInfo = ref<string | undefined>();

	const isVisible_ChangeBalanceModal = ref<boolean>(false);

	const router = useRouter();
	const route = useRoute();
	const id = ref<string>('');
	const card = ref<Card | undefined>();

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

	onBeforeMount(() => {
		id.value = (route.params as RequestCardIdParam).id;
		card.value = walletStore.getCard_ById(id.value);
	});

	onMounted(() => {
		cardHeight.value = elementHeight_Relative_PreviousSiblingAndWindowHeight('.card__title-block');
	});

	const onEditCardModalOpen = () => {
		if (card.value!.virtualList.length > 0) {
			isVisibleMessageBox.value = true;
			messageBoxTitle.value = 'Warning!';
			messageBoxMessage.value = 'This card has virtuals. Editing is not possible!';
		} else {
			isVisible_EditInfoModal.value = true;
		}
	};

	const onEditCardInfo = (editedCard: Card) => {
		card.value = editedCard;
	};

	const onConfirmDelete = () => {
		confirmAction.value = 'Confirm deletion';
		if (!card.value!.isVirtual && card.value!.virtualList.length > 0) {
			confirmInfo.value =
				'This is the base card. Deleting it will also delete all its virtual cards. Are you sure? This action is irreversible!';
		}
		isVisible_ConfirmModal.value = true;
	};

	const deleteCard = () => {
		walletStore.deleteCard(id.value);
		router.push('/cards-view');
	};

	const onShow_ChangeBalanceModal = () => {
		isVisible_ChangeBalanceModal.value = true;
	};

	function doCancel() {
		router.push('/cards-view');
	}

	function goHome() {
		router.push('/');
	}
</script>

<style scoped lang="scss">
	@import './card-one.scss';
</style>
