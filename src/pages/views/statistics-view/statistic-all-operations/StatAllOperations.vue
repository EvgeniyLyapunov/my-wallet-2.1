<template>
	<div class="stat-all">
		<!-- header -->
		<section class="stat-all__header header">
			<h1 class="header__title">Движение средств</h1>
			<div class="breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Домашняя</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__link" @click="onRouteStatisticsView">Статистика</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">Движение средств</span>
			</div>
		</section>

		<!-- main -->
		<main class="stat-all__main main">
			<!-- resume -->
			<section class="main-resum">
				<div class="main-resum__field">
					<span class="main-resum__field-label">Начало периода:</span>
					<span class="main-resum__field-value">{{
						moment.tz(resume.begin, 'Europe/Moscow').format('DD.MM.YYYY')
					}}</span>
				</div>
				<div class="main-resum__field">
					<span class="main-resum__field-label">Конец периода:</span>
					<span class="main-resum__field-value">{{
						moment.tz(resume.end, 'Europe/Moscow').format('DD.MM.YYYY')
					}}</span>
				</div>
				<div class="main-resum__field">
					<span class="main-resum__field-label">Сумма за период:</span>
					<span class="main-resum__field-value">{{ resume.amount }}</span>
				</div>
			</section>
			<!-- chart -->
			<section class="main-chart">
				<VueApexCharts
					type="line"
					:key="chartUpdateKey"
					:height="chartHeight"
					:options="chartOptions"
					:series="series"
				></VueApexCharts>
			</section>
			<!-- period -->
			<section class="main-period">
				<span class="main-period__label">Период на графике:</span>
				<VRadioGroup v-model="radioPeriod">
					<VRadio color="#fff" value="Today">
						<template #label>
							<span class="main-period__radio-label">Сегодня</span>
						</template>
					</VRadio>
					<VRadio color="#fff" value="Current Week">
						<template #label>
							<span class="main-period__radio-label">Текущая неделя</span>
						</template>
					</VRadio>
					<VRadio color="#fff" label="Текущий месяц" value="Current Month">
						<template #label>
							<span class="main-period__radio-label">Текущий месяц</span>
						</template>
					</VRadio>
					<VRadio color="#fff" value="Salary Month">
						<template #label>
							<span class="main-period__radio-label">Финансовый месяц</span>
						</template>
					</VRadio>
				</VRadioGroup>
			</section>
		</main>

		<!-- actions -->
		<section class="stat-all__actions actions">
			<v-btn
				class="actions__btn actions__btn-home"
				prepend-icon="mdi-home"
				density="default"
				width="120"
				variant="elevated"
				@click="onRouteHome"
				>Домой</v-btn
			>
			<v-btn
				class="actions__btn actions__btn-close"
				prepend-icon="mdi-close"
				density="default"
				width="120"
				variant="elevated"
				@click="onRouteStatisticsView"
				>Закрыть</v-btn
			>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { nanoid } from 'nanoid';
	import VueApexCharts from 'vue3-apexcharts';
	import { useStatisticsStore } from '@/stores/statisticsStore';
	import { useOperationsStore } from '@/stores/operationsStore';
	import moment from 'moment-timezone';
	import type {
		IStatAllOptions,
		IStatAllResume,
		StatisticsPeriodType,
	} from '@/models/types/cardTypes';

	definePage({
		name: 'stat-all-operations',
		path: '/stat-all-operations',
	});

	const { get_StatAllPeriodOption, set_StatisticPeriod } = useStatisticsStore();
	const { get_operationsByPeriod } = useOperationsStore();

	const resume = ref<IStatAllResume>({
		begin: moment.tz('Europe/Moscow').toDate(),
		end: moment.tz('Europe/Moscow').toDate(),
		amount: 0,
	});

	const chartHeight = ref<number>(0);
	const chartUpdateKey = ref<string>('1');
	const xAxis = ref<string[]>([]);
	const yAxis = ref<number[]>([]);

	let series = reactive([
		{
			name: 'Сумма',
			data: yAxis.value,
		},
	]);

	let chartOptions = reactive({
		chart: {
			type: 'line',
			height: `${chartHeight.value}`,
			zoom: {
				enabled: false,
			},
			toolbar: {
				show: false, // Отключаем бургер-меню (toolbar)
			},
			dropShadow: {
				enabled: true,
				color: '#000',
				top: 18,
				left: 7,
				blur: 10,
				opacity: 0.5,
			},
		},
		dataLabels: {
			enabled: false,
		},
		colors: ['#1E88E5', '#EF5350'],
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

	onBeforeMount(() => {
		const clientHeight = Math.floor(document.documentElement.clientHeight);
		if (clientHeight > 770) {
			chartHeight.value = 350;
		} else {
			chartHeight.value = 250;
		}
	});

	onMounted(async () => {
		await nextTick();
		initStatisticChart();
		chartUpdateKey.value = nanoid();
	});

	onBeforeUnmount(() => {
		xAxis.value = [];
		yAxis.value = [];
	});

	const initStatisticChart = () => {
		const periodObj: IStatAllOptions = get_StatAllPeriodOption();
		xAxis.value = [];
		yAxis.value = [];

		const operationsList = get_operationsByPeriod(periodObj.from);
		operationsList.sort((a, b) => {
			return (
				moment.tz(a.date, 'Europe/Moscow').startOf('minute').toDate().getTime() -
				moment.tz(b.date, 'Europe/Moscow').startOf('minute').toDate().getTime()
			);
		});

		const periodDates: Date[] = [];
		const from = moment.tz(periodObj.from, 'Europe/Moscow').startOf('day');
		const to = moment.tz(periodObj.to, 'Europe/Moscow').startOf('day');

		for (let m = to.clone(); m.isSameOrAfter(from); m.subtract(1, 'days')) {
			periodDates.push(m.toDate());
		}

		periodDates.reverse();

		periodDates.forEach((d, index) => {
			const day = moment(d).date().toString();
			const amount = operationsList
				.filter((op: { date: moment.MomentInput }) => {
					const opDate = moment(op.date).startOf('day');
					const currentItemDate = moment(d).startOf('day');
					return opDate.isSame(currentItemDate);
				})
				.reduce((acc: any, item: { type: string; amount: number }) => {
					const sum = item.type === 'minus' ? -Math.abs(item.amount) : item.amount;
					const res = acc + sum;
					return res;
				}, 0);

			xAxis.value.push(day);
			yAxis.value.push(amount);
		});

		series[0].data = yAxis.value;
		chartOptions.xaxis.categories = xAxis.value;

		resume.value = {
			begin: periodObj.from,
			end: periodObj.to,
			amount: yAxis.value.reduce((acc, item) => acc + item, 0),
		};
	};

	const radioPeriod = ref<StatisticsPeriodType>('Salary Month');

	watch(
		() => radioPeriod.value,
		(newValue) => {
			set_StatisticPeriod(newValue);
			initStatisticChart();
			chartUpdateKey.value = nanoid();
		}
	);

	const router = useRouter();
	const breadcrumbsDivider: string = '/';

	const onRouteStatisticsView = () => {
		router.push('/statistics-view');
	};

	const onRouteHome = () => {
		router.push('/');
	};
</script>

<style scoped lang="scss">
	@import './stat-all-operations.scss';
</style>
