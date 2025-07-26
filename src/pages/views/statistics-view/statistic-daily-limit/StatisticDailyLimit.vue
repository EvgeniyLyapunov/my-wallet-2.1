<template>
	<div class="stat-lim">
		<!-- header -->
		<section class="stat-lim__header header">
			<h1 class="header__title">Дневной лимит</h1>
			<div class="breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Домашняя</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__link" @click="onRouteStatisticsView">Статистика</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">Дневной лимит</span>
			</div>
		</section>

		<!-- main -->
		<main class="stat-lim__main main">
			<!-- resume -->
			<section class="main-resum">
				<div class="main-resum__field">
					<span class="main-resum__field-label">Период:</span>
					<div class="main-resum__field-value-block">
						<span class="main-resum__field-value">{{
							moment.tz(resume.begin, 'Europe/Moscow').format('DD.MM.YYYY')
						}}</span>
						<span class="main-resum__field-value-devider">/</span>
						<span class="main-resum__field-value">{{
							moment.tz(resume.end, 'Europe/Moscow').format('DD.MM.YYYY')
						}}</span>
					</div>
				</div>
				<div class="main-resum__field">
					<span class="main-resum__field-label">Сумма за период:</span>
					<span class="main-resum__field-value">{{
						new Intl.NumberFormat('ru', {
							style: 'currency',
							currency: 'RUB',
							minimumFractionDigits: 0,
						}).format(resume.amount)
					}}</span>
				</div>
				<div class="main-resum__field">
					<span class="main-resum__field-label">Дневной лимит:</span>
					<span class="main-resum__field-value">{{
						new Intl.NumberFormat('ru', {
							style: 'currency',
							currency: 'RUB',
							minimumFractionDigits: 0,
						}).format(resume.dailyLimit)
					}}</span>
				</div>
				<div class="main-resum__field">
					<span class="main-resum__field-label">Динамический лимит:</span>
					<span class="main-resum__field-value">{{
						new Intl.NumberFormat('ru', {
							style: 'currency',
							currency: 'RUB',
							minimumFractionDigits: 0,
						}).format(resume.dynamicDailyLimit)
					}}</span>
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
				<VRadioGroup v-model="radioPeriod" class="main-period__radio-group" :inline="true">
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
				<v-checkbox
					v-model="isDailyDynamicLimit"
					color="orange"
					label="Показать динамический дневной лимит"
					hide-details
				></v-checkbox>
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
	import moment from 'moment';
	import VueApexCharts from 'vue3-apexcharts';
	import type {
		IStatOptions,
		IStatAllResume,
		StatisticsPeriodType,
		IStatDailyLimit,
	} from '@/models/types/cardTypes';

	definePage({
		name: 'statistic_daily_limit',
		path: '/statistic-daily-limit',
	});

	moment.updateLocale('en', {
		week: {
			dow: 1, // Устанавливаем понедельник как первый день недели
		},
	});

	const { get_StatAllPeriodOption, set_StatisticPeriod } = useStatisticsStore();
	const { get_operationsByPeriod } = useOperationsStore();
	const { get_SettingsObject } = useSettingsStore();

	const resume = ref<IStatDailyLimit>({
		begin: moment.tz('Europe/Moscow').toDate(),
		end: moment.tz('Europe/Moscow').toDate(),
		amount: 0,
		dailyLimit: 0,
		dynamicDailyLimit: 0,
	});

	const chartHeight = ref<number>(0);
	const chartUpdateKey = ref<string>('1');
	const xAxis = ref<string[]>([]);
	const yAxis = ref<number[]>([]);
	const yAxisDailyLimit = ref<number[]>([]);
	const yAxisDynamicDailyLimit = ref<number[]>([]);

	let series = reactive([
		{
			name: 'Сумма',
			data: yAxis.value,
		},
		{
			name: 'Дневной лимит',
			data: yAxisDailyLimit,
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
		colors: ['#1E88E5', '#fff', '#ff9800'],
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
		yAxisDailyLimit.value = [];
		yAxisDynamicDailyLimit.value = [];
	});

	const initStatisticChart = () => {
		const periodObj: IStatOptions = get_StatAllPeriodOption();
		radioPeriod.value = periodObj.periodType;

		xAxis.value = [];
		yAxis.value = [];
		yAxisDailyLimit.value = [];
		yAxisDynamicDailyLimit.value = [];

		let dailyLimit = -Math.abs(get_SettingsObject().dailyLimit);

		// если выбран показ ежедневного лимита, на график добавляется новая линия
		if (isDailyDynamicLimit.value) {
			if (!series[2]) {
				series.push({
					name: 'Динамический лимит',
					data: [],
				});
			}
		} else {
			if (series[2]) {
				series.pop();
			}
		}

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

		// начальная инициализация переменной динамического лимита
		let dynamicLimit = -Math.abs(get_SettingsObject().dailyLimit);

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
			yAxisDailyLimit.value.push(dailyLimit);

			// если не выбран показ ежедневного лимита к следующей итерации
			if (!isDailyDynamicLimit.value) return;

			// если это первая итерация, то ежедневный динамический лимит равен ежедневному лимиту
			if (index === 0) {
				yAxisDynamicDailyLimit.value.push(dailyLimit);
				return;
			}

			// если это не первая итерация, получаем сумму расхода за предыдущий день
			const previousAmount = yAxis.value[index - 1];

			// динамический лимит - динамический лимит за предыдущий день
			// плюс/минус разница динамического лимит за предыдущий день и суммы расхода за предыдущий день
			dynamicLimit = dynamicLimit += dailyLimit - previousAmount;
			if (dynamicLimit <= 0) {
				yAxisDynamicDailyLimit.value.push(dynamicLimit);
			} else {
				yAxisDynamicDailyLimit.value.push(0);
			}
		});

		series[0].data = yAxis.value;
		series[1].data = yAxisDailyLimit.value;
		if (series[2]) {
			series[2].data = yAxisDynamicDailyLimit.value;
		}

		chartOptions.xaxis.categories = xAxis.value;

		let resumeDynamicLimit: number = 0;
		if (dynamicLimit > 0) {
			resumeDynamicLimit = dynamicLimit;
		} else {
			resumeDynamicLimit = Math.abs(dynamicLimit);
		}

		resume.value = {
			begin: periodObj.from,
			end: periodObj.to,
			amount: yAxis.value.reduce((acc, item) => acc + item, 0),
			dailyLimit: Math.abs(dailyLimit),
			dynamicDailyLimit: isDailyDynamicLimit.value ? resumeDynamicLimit : 0,
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

	const isDailyDynamicLimit = ref<boolean>(false);

	watch(
		() => isDailyDynamicLimit.value,
		(newValue) => {
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
	@import './statistic-daily-limit.scss';
</style>
