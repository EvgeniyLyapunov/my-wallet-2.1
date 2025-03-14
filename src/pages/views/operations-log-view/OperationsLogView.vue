<template>
	<div class="operations-log ol">
		<div class="ol__title-block">
			<h1 class="ol__title">Operations log</h1>
			<div class="ol__breadcrumbs breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Home</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">Operation log</span>
			</div>
		</div>
		<main class="ol__main main">
			<div class="main__log" :key="refreshKey">
				<OperationLogItem v-for="(item, i) in logList" :key="i" :log-item="item" />
			</div>
			<div class="main__controls">
				<v-btn class="button" @click="onDeleteToday">delete Today</v-btn>
				<v-btn class="button" @click="onDeleteAll">delete All</v-btn>
				<v-btn class="button" @click="onRouteHome">Home</v-btn>
			</div>
		</main>
		<footer class="ol__footer footer"></footer>
	</div>
</template>

<script setup lang="ts">
	import OperationLogItem from '@/pages/components/operation-log-item/OperationLogItem.vue';
	import { useOperationsStore } from '@/stores/operationsStore';
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
	const sourceOperationsList = ref<IOperation[]>([]);

	const router = useRouter();
	const breadcrumbsDivider: string = '/';

	onMounted(() => {
		initList();
	});

	const initList = () => {
		sourceOperationsList.value = getOperationsList();
		sourceOperationsList.value.reverse();
		let logDate: string;
		sourceOperationsList.value.forEach((item, index) => {
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
		refreshKey.value = nanoid();
	};

	const onDeleteToday = () => {
		delete_TodayOperations();
		logList.value = [];
		refreshKey.value = nanoid();
		nextTick();
		initList();
	};

	const onDeleteAll = () => {
		delete_AllOperations();
		logList.value = [];
		refreshKey.value = nanoid();
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
