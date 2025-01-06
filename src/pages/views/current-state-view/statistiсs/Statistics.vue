<template>
	<div class="statistics s">
		<header class="s__title-block">
			<h1 class="s__title">Statistics</h1>
			<div class="s__breadcrumbs breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Home</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__link" @click="onRouteCurrentState">Current state</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">Statistic</span>
			</div>
		</header>

		<main class="s__main">
			<section class="s__main-subtitle sub">
				<div class="sub__period">
					<span class="sub__period-label">Period:</span>
					<span class="sub__period-value">{{ subtitle ? subtitle.period : '' }}</span>
				</div>
				<div class="sub__filters">
					<span class="sub__filters-label">Filters:</span>
					<ul v-if="subtitle && subtitle.filters.length > 0">
						<li v-for="(item, i) in subtitle.filters" :key="i">
							{{ item }}{{ subtitle.filters.length - 1 === i ? '.' : ',' }}
						</li>
					</ul>
					<span v-else>no filters</span>
				</div>
			</section>
			<section class="s__main-chart">
				<VueApexCharts
					type="line"
					:key="chartUpdateKey"
					:height="chartHeight"
					:options="chartOptions"
					:series="series"
				></VueApexCharts>
			</section>
			<section class="s__main-resum resum">
				<div class="resum__begin">
					<span class="resum__begin-label">Date begin:</span>
					<span class="resum__begin-value"></span>
				</div>
				<div class="resum__end">
					<span class="resum__end-label">Date end:</span>
					<span class="resum__end-value"></span>
				</div>
				<div class="resum__amount">
					<span class="resum__amount-label">Amount changes:</span>
					<span class="resum__amount-value"></span>
				</div>
			</section>
			<section class="s__main-btns btns">
				<v-btn class="btns__options-btn" @click="onStatisticOptionsModalOpen"
					>Statistics Options</v-btn
				>
			</section>
		</main>

		<footer class="s__footer">
			<v-btn class="s__footer-btn s__footer-btn-home" @click="onRouteHome">Home</v-btn>
			<v-btn class="s__footer-btn s__footer-btn-close" @click="onRouteCurrentState">Close</v-btn>
		</footer>
	</div>

	<StatisticOptionsModal v-model="isVisible_StatisticOptionsModal" />
</template>

<script setup lang="ts">
	import { nanoid } from 'nanoid';
	import VueApexCharts from 'vue3-apexcharts';
	import { useStatisticsStore } from '@/stores/statisticsStore';
	import { useOperationsStore } from '@/stores/operationsStore';
	import type {
		IOperation,
		IStatisticOptions,
		IStatisticsSubtitle,
	} from '@/models/types/cardTypes';

	import StatisticOptionsModal from '@/pages/components/statistic-options-modal/StatisticOptionsModal.vue';
	import moment from 'moment-timezone';

	definePage({
		name: 'statistics',
		path: '/statistics',
	});

	moment.updateLocale('en', {
		week: {
			dow: 1, // Устанавливаем понедельник как первый день недели
		},
	});

	const { get_StatisticsSubtitle, get_StatisticOptions } = useStatisticsStore();
	const { get_OperationsByStatisticOptions } = useOperationsStore();

	const chartHeight = ref<number>(0);
	const chartUpdateKey = ref<string>('1');

	const subtitle = ref<IStatisticsSubtitle>();
	const xAxis = ref<string[]>([]);
	const yAxis = ref<number[]>([]);

	const series = reactive([
		{
			name: 'Amount',
			data: yAxis.value,
		},
	]);

	const chartOptions = reactive({
		chart: {
			type: 'line',
			height: `${chartHeight.value}`,
			zoom: {
				enabled: false,
			},
			toolbar: {
				show: false, // Отключаем бургер-меню (toolbar)
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'smooth',
		},
		markers: {
			size: 0,
		},
		xaxis: {
			categories: xAxis.value,
		},
	});

	const isVisible_StatisticOptionsModal = ref<boolean>(false);

	const onStatisticOptionsModalOpen = () => {
		isVisible_StatisticOptionsModal.value = true;
	};

	onBeforeMount(() => {
		const clientHeight = Math.floor(document.documentElement.getBoundingClientRect().height);
		if (clientHeight > 770) {
			chartHeight.value = 430;
		} else {
			chartHeight.value = 280;
		}
		initStatisticChart();
	});

	onMounted(async () => {
		subtitle.value = get_StatisticsSubtitle;

		await nextTick();
		chartUpdateKey.value = nanoid();
	});

	onBeforeUnmount(() => {
		xAxis.value = [];
		yAxis.value = [];
	});

	const initStatisticChart = () => {
		const optionsObj: IStatisticOptions = get_StatisticOptions();
		const operationsList = get_OperationsByStatisticOptions(optionsObj);
		operationsList.sort((a, b) => {
			return (
				moment.tz(a.date, 'Europe/Moscow').startOf('minute').toDate().getTime() -
				moment.tz(b.date, 'Europe/Moscow').startOf('minute').toDate().getTime()
			);
		});

		operationsList.forEach((operation) => {
			const day = moment(operation.date).date().toString();
			xAxis.value.push(day);
			const amount = operation.type === 'minus' ? -Math.abs(operation.amount) : operation.amount;
			yAxis.value.push(amount);
		});
	};

	const router = useRouter();
	const breadcrumbsDivider: string = '/';

	const onRouteCurrentState = () => {
		router.push('/current-state-view');
	};

	const onRouteHome = () => {
		router.push('/');
	};
</script>

<style scoped lang="scss">
	@import './statistics.scss';
</style>
