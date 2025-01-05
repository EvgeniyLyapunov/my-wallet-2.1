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
	import VueApexCharts from 'vue3-apexcharts';
	import { useStatisticsStore } from '@/stores/statisticsStore';
	import type { IStatisticsSubtitle } from '@/models/types/cardTypes';

	import StatisticOptionsModal from '@/pages/components/statistic-options-modal/StatisticOptionsModal.vue';

	definePage({
		name: 'statistics',
		path: '/statistics',
	});

	const statisticsStore = useStatisticsStore();

	const chartHeight = ref<number>(0);

	const subtitle = ref<IStatisticsSubtitle>();

	const series = ref([
		{
			name: 'Desktops',
			data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
		},
	]);

	const chartOptions = ref({
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
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
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
	});

	onMounted(() => {
		subtitle.value = statisticsStore.get_StatisticsSubtitle;
	});

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
