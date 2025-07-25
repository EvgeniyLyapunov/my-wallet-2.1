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
			<div class="main__controls">
				<v-btn class="button" @click="onDeleteToday">Удалить сегодня</v-btn>
				<v-btn class="button" @click="onDeleteAll">Удалить всё</v-btn>
				<v-btn class="button" @click="onRouteHome">Домой</v-btn>
			</div>
		</main>
		<footer class="ol__footer footer"></footer>
	</div>

	<Confirm
		v-model="isConfirmModalVisible"
		:confirm-action="'Подтвердите ваше действие!'"
		@confirm="onConfirmation"
	/>
</template>

<script setup lang="ts">
	import OperationLogItem from '@/pages/components/operation-log-item/OperationLogItem.vue';
	import { useOperationsStore } from '@/stores/operationsStore';
	import Confirm from '@/pages/components/confirms/Confirm.vue';
	import type { IOperation } from '@/models/types/cardTypes';
	import moment from 'moment';
	import { nanoid } from 'nanoid';

	definePage({
		name: 'operationsLog_view',
		path: '/operations-log-view',
	});

	const { getOperationsList, delete_TodayOperations, delete_AllOperations } = useOperationsStore();
	const refreshKey = ref<string>(nanoid());
	const logList = ref<(IOperation | string)[]>([]);

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

	const deletePoint = ref<'today' | 'all' | ''>('');

	const onDeleteToday = () => {
		deletePoint.value = 'today';
		isConfirmModalVisible.value = true;
	};

	const onDeleteAll = () => {
		deletePoint.value = 'all';
		isConfirmModalVisible.value = true;
	};

	const isConfirmModalVisible = ref<boolean>(false);
	const onConfirmation = () => {
		if (deletePoint.value === '') return;
		if (deletePoint.value === 'all') {
			delete_AllOperations();
		} else if (deletePoint.value === 'today') {
			delete_TodayOperations();
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
