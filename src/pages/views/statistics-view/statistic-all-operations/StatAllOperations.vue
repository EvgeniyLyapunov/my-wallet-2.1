<template>
  <div class="stat-all">
    <!-- header -->
    <section class="stat-all__header header">
      <h1 class="header__title">Движение средств</h1>
      <div class="breadcrumbs">
        <span class="breadcrumbs__link" @click="onRouteHome">Домашняя</span>
        <span class="breadcrumbs__divider"
          >&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span
        >
        <span class="breadcrumbs__link" @click="onRouteStatisticsView"
          >Статистика</span
        >
        <span class="breadcrumbs__divider"
          >&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span
        >
        <span class="breadcrumbs__end">Движение средств</span>
      </div>
    </section>

    <!-- main -->
    <main class="stat-all__main main">
      <!-- resume -->
      <section class="main-resum">
        <div
          v-if="settingsObject.statisticSubjectCard"
          class="main-resum__field"
        >
          <span class="main-resum__field-label">Карта:</span>
          <span class="main-resum__field-value">{{
            getCardName_ById(settingsObject.statisticSubjectCard!)
          }}</span>
        </div>
        <div class="main-resum__field">
          <span class="main-resum__field-label">Период:</span>
          <div class="main-resum__field-value-block">
            <span class="main-resum__field-value">{{
              dayjs.tz(resume.begin).format("DD.MM.YYYY")
            }}</span>
            <span class="main-resum__field-value-devider">/</span>
            <span class="main-resum__field-value">{{
              dayjs.tz(resume.end).format("DD.MM.YYYY")
            }}</span>
          </div>
        </div>
        <div class="main-resum__field">
          <span class="main-resum__field-label">Сумма за период:</span>
          <span class="main-resum__field-value">{{
            new Intl.NumberFormat("ru", {
              style: "currency",
              currency: "RUB",
              minimumFractionDigits: 0,
            }).format(resume.amount)
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
        <VRadioGroup v-model="radioPeriod" :inline="true">
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
import { nanoid } from "nanoid";
import { defineAsyncComponent } from "vue";
import dayjs, { type ConfigType } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import type {
  IStatOptions,
  IStatAllResume,
  StatisticsPeriodType,
} from "@/models/types/cardTypes";
import { useRouter } from "vue-router";

const VueApexCharts = defineAsyncComponent(() => import("vue3-apexcharts"));

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);
dayjs.extend(isSameOrAfter);

dayjs.updateLocale("en", {
  weekStart: 1, // Устанавливаем понедельник как первый день недели
});

const { get_StatAllPeriodOption, set_StatisticPeriod } = useStatisticsStore();
const { get_operationsByPeriod } = useOperationsStore();
const { settingsObject } = useSettingsStore();
const { getCardName_ById } = useWalletStore();

const resume = ref<IStatAllResume>({
  begin: dayjs().tz().toDate(),
  end: dayjs().tz().toDate(),
  amount: 0,
});

const chartHeight = ref<number>(0);
const chartUpdateKey = ref<string>("1");
const xAxis = ref<string[]>([]);
const yAxis = ref<number[]>([]);

let series = reactive([
  {
    name: "Сумма",
    data: yAxis.value,
  },
]);

let chartOptions = reactive({
  chart: {
    type: "line",
    height: `${chartHeight.value}`,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false, // Отключаем бургер-меню (toolbar)
    },
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.5,
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: ["#1E88E5", "#EF5350"],
  stroke: {
    curve: "smooth",
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
  const periodObj: IStatOptions = get_StatAllPeriodOption();
  radioPeriod.value = periodObj.periodType;
  xAxis.value = [];
  yAxis.value = [];

  const operationsList = get_operationsByPeriod(periodObj.from);
  operationsList.sort((a, b) => {
    return (
      dayjs.tz(a.date).startOf("minute").toDate().getTime() -
      dayjs.tz(b.date).startOf("minute").toDate().getTime()
    );
  });

  const periodDates: Date[] = [];
  const from = dayjs.tz(periodObj.from).startOf("day");
  const to = dayjs.tz(periodObj.to).startOf("day");

  for (let m = to.clone(); m.isSameOrAfter(from); m = m.subtract(1, "days")) {
    periodDates.push(m.toDate());
  }

  periodDates.reverse();

  periodDates.forEach((d, index) => {
    const day = dayjs(d).date().toString();
    const amount = operationsList
      .filter((op: { date: dayjs.ConfigType }) => {
        const opDate = dayjs(op.date).startOf("day");
        const currentItemDate = dayjs(d).startOf("day");
        return opDate.isSame(currentItemDate);
      })
      .reduce((acc: any, item: { type: string; amount: number }) => {
        const sum =
          item.type === "minus" ? -Math.abs(item.amount) : item.amount;
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

const radioPeriod = ref<StatisticsPeriodType>("Salary Month");

watch(
  () => radioPeriod.value,
  (newValue) => {
    set_StatisticPeriod(newValue);
    initStatisticChart();
    chartUpdateKey.value = nanoid();
  },
);

const router = useRouter();
const breadcrumbsDivider: string = "/";

const onRouteStatisticsView = () => {
  router.push("/statistics-view");
};

const onRouteHome = () => {
  router.push("/");
};
</script>

<style scoped lang="scss">
@import "./stat-all-operations.scss";
</style>
