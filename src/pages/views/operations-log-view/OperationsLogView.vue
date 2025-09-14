<template>
	<div class="operations-log ol">
		<div class="ol__title-block">
			<h1 class="ol__title">Журнал операций</h1>
			<div class="ol__breadcrumbs breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Домашняя</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">Журнал операций</span>
			</div>
		</div>
		<main class="ol__main main">
			<div class="main__log" :key="refreshKey">
				<OperationLogItem v-for="(item, i) in logList" :key="i" :log-item="item" />
			</div>
		</main>
		<footer class="ol__footer footer">
			<OperationsLogControlsPanel
				:is-show="isControlsPanelShow"
				@delete-point-select="onDeletePointSelect"
				@toggle-visible="onControlsPanelToggleShow"
			/>
			<v-btn
				class="footer__button"
				prepend-icon="mdi-home"
				density="default"
				width="120"
				variant="elevated"
				@click="onRouteHome"
			>
				Домой
			</v-btn>
			<v-icon class="footer__btn-show-controls" @click="() => onControlsPanelToggleShow(true)"
				>mdi-eraser</v-icon
			>
		</footer>
	</div>

	<Confirm
		v-model="isConfirmModalVisible"
		:confirm-action="'Подтвердите ваше действие!'"
		@confirm="onConfirmation"
	/>
</template>

<script setup lang="ts">
	import OperationLogItem from '@/pages/components/operation-log-item/OperationLogItem.vue';
	import OperationsLogControlsPanel from '@/pages/components/operation-log-controls/OperationsLogControlsPanel.vue';
	import { useOperationsStore } from '@/stores/operationsStore';
	import Confirm from '@/pages/components/confirms/Confirm.vue';
	import type { IOperation, DeletePointType } from '@/models/types/cardTypes';
	import moment from 'moment';
	import { nanoid } from 'nanoid';

	definePage({
		name: 'operationsLog_view',
		path: '/operations-log-view',
	});

	const { getOperationsList, delete_lastOperation, delete_TodayOperations, delete_AllOperations } =
		useOperationsStore();
	const refreshKey = ref<string>(nanoid());
	const logList = ref<(IOperation | string)[]>([]);

	const isControlsPanelShow = ref<boolean>(false);
	const isConfirmModalVisible = ref<boolean>(false);

	const router = useRouter();
	const breadcrumbsDivider: string = '/';

	refreshKey.value = nanoid();

	onMounted(async () => {
		await initList();
	});

	const elem: HTMLElement | null = document.querySelector('.main__log');

	if (elem) {
		elem.classList.contains('.class');
		elem.textContent;
	}

	const initList = async () => {
		logList.value = [];

		const rawOperations = getOperationsList();
		const sortedOperations = rawOperations.sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});

		let logDate: string;
		sortedOperations.forEach((item, index) => {
			if (index === 0) {
				logDate = moment(item.date).format('DD.MM.YYYY');
				logList.value.push(logDate);
				logList.value.push(item);
				return;
			}

			if (moment(item.date).format('DD.MM.YYYY') === logDate) {
				logList.value.push(item);
			} else {
				logDate = moment(item.date).format('DD.MM.YYYY');
				logList.value.push(logDate);
				logList.value.push(item);
			}
		});

		await nextTick();
		refreshKey.value = nanoid();
	};

	const deletePoint = ref<DeletePointType>('');

	const onControlsPanelToggleShow = (isShow: boolean) => {
		isControlsPanelShow.value = isShow;
	};

	const onDeletePointSelect = (point: DeletePointType) => {
		deletePoint.value = point;
		isConfirmModalVisible.value = true;
		isControlsPanelShow.value = false;
	};

	const onConfirmation = () => {
		if (deletePoint.value === '') return;

		switch (deletePoint.value) {
			case 'lastOperation':
				delete_lastOperation();
				break;
			case 'today':
				delete_TodayOperations();
				break;
			case 'beforeCurrentMonth':
				break;
			case 'beforeCurentSalaryMonth':
				break;
			case 'all':
				delete_AllOperations();
				break;
		}

		logList.value = [];

		refreshKey.value = nanoid();
		deletePoint.value = '';
		nextTick();
		initList();
	};

	const onRouteHome = () => {
		router.push('/');
	};
</script>

<style scoped lang="scss">
	@import './operations-log-view.scss';
</style>
