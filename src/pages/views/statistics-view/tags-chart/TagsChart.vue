<template>
  <div class="tags-chart">
    <!-- header -->
    <section class="tags-chart__header header">
      <h1 class="header__title">Расходы по тегам</h1>
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
        <span class="breadcrumbs__end">Расходы по тегам</span>
      </div>
    </section>

    <!-- main -->
    <main class="tags-chart__main main">
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
          type="pie"
          :key="chartUpdateKey"
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
import dayjs from "dayjs";
import type {
  IStatAllResume,
  IStatOptions,
  StatisticsPeriodType,
} from "@/models/types/cardTypes";
import { useRouter } from "vue-router";

const VueApexCharts = defineAsyncComponent(() => import("vue3-apexcharts"));

const { get_StatAllPeriodOption, set_StatisticPeriod } = useStatisticsStore();
const { get_operationsByPeriod } = useOperationsStore();
const { get_TagFromStatisticTagsList, refreshStatisticsTags } = useTagsStore();
const { get_SettingsObject, settingsObject } = useSettingsStore();
const { getCardName_ById } = useWalletStore();

const resume = ref<IStatAllResume>({
  begin: dayjs().tz().toDate(),
  end: dayjs().tz().toDate(),
  amount: 0,
});

const chartUpdateKey = ref<string>("1");

const series = ref<number[]>([]);

const chartOptions = reactive({
  chart: {
    type: "pie",
  },
  legend: {
    position: "bottom",
  },
  labels: [] as string[],
  colors: [] as string[],
  tooltip: {
    y: {
      formatter: function (val: number) {
        return new Intl.NumberFormat("ru", {
          style: "currency",
          currency: "RUB",
          minimumFractionDigits: 0,
        }).format(val);
      },
    },
  },
});

refreshStatisticsTags();

onMounted(async () => {
  await nextTick();
  initTagsChart();
  chartUpdateKey.value = nanoid();
});

const initTagsChart = () => {
  const periodObj: IStatOptions = get_StatAllPeriodOption();
  radioPeriod.value = periodObj.periodType;
  series.value = [];
  chartOptions.labels = [];

  const operationsList = get_operationsByPeriod(periodObj.from);
  operationsList.sort((a, b) => {
    return (
      dayjs.tz(a.date).startOf("minute").toDate().getTime() -
      dayjs.tz(b.date).startOf("minute").toDate().getTime()
    );
  });

  const uniqeTagIds = new Set<string>();
  operationsList.forEach((item) => {
    if (!item.tag) return;
    uniqeTagIds.add(item.tag);
  });

  const tagIds = Array.from(uniqeTagIds);
  const currentLabels: string[] = [];
  const currentAmounts: number[] = [];
  const currentColors: string[] = [];

  tagIds.forEach((item) => {
    currentLabels.push(get_TagFromStatisticTagsList(item)!.Name);
    const sum = operationsList
      .filter((o) => o.tag === item)
      .reduce((acc, u) => {
        return acc + u.amount;
      }, 0);
    currentAmounts.push(sum);
    currentColors.push(get_TagFromStatisticTagsList(item)!.Color!);
  });

  series.value = currentAmounts;
  chartOptions.labels = currentLabels;
  chartOptions.colors = currentColors;

  resume.value = {
    begin: periodObj.from,
    end: periodObj.to,
    amount: currentAmounts.reduce((acc, item) => acc + item, 0),
  };

  chartUpdateKey.value = nanoid();
};

const radioPeriod = ref<StatisticsPeriodType>("Salary Month");

watch(
  () => radioPeriod.value,
  (newValue) => {
    set_StatisticPeriod(newValue);
    initTagsChart();
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
@use "./tags-chart.scss" as *;
</style>
