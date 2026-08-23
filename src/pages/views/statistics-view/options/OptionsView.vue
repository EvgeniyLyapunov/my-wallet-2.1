<template>
  <div class="options">
    <!-- header -->
    <section class="options__header header">
      <h1 class="header__title">Опции и константы</h1>
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
        <span class="breadcrumbs__end">Опции и константы</span>
      </div>
    </section>

    <!-- main -->
    <main class="options__main main">
      <div class="main__field">
        <span class="main__field-label">Начало финансового месяца:</span>
        <input
          id="input-salary-month"
          class="main__field-value"
          type="number"
          v-model="inputSalary"
          @focus="onInputFocus"
        />
        <span v-if="isSalaryInputError" class="main__field-error">
          Введите значение в диапазоне от 1 до 28
        </span>
      </div>
      <div class="main__field">
        <span class="main__field-label">Дневной лимит:</span>
        <input class="main__field-value" type="number" v-model="inputLimit" />
      </div>
      <div class="main__field-select">
        <span class="main__field-select-label">Статистика для карты:</span>
        <v-select
          v-model="selectDailyLimitCard"
          :items="walletStore.dailyLimitCardArray"
          style="color: #fff; width: 100%"
          variant="outlined"
          label="Карта:"
          :clearable="true"
        ></v-select>
      </div>
      <div class="main__field">
        <span class="main__field-label">Сброс кэша приложения:</span>
        <v-btn
          class="actions__btn"
          density="default"
          width="100"
          color="warning"
          variant="tonal"
          @click="onHardUpdateApp"
          >Очистить</v-btn
        >
      </div>
    </main>

    <!-- actions -->
    <section class="options__actions actions">
      <v-btn
        class="actions__btn actions__btn-home"
        density="default"
        width="100"
        variant="elevated"
        @click="onRouteHome"
      >
        Домой
      </v-btn>
      <v-btn
        class="actions__btn actions__btn-save"
        width="100"
        variant="elevated"
        color="#0288D1"
        @click="onSave"
      >
        Сохранить
      </v-btn>
      <v-btn
        class="actions__btn actions__btn-close"
        density="default"
        width="100"
        variant="elevated"
        @click="onRouteStatisticsView"
      >
        Закрыть
      </v-btn>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores/settingsStore";
import { useWalletStore } from "@/stores/walletStore";
import { useRouter } from "vue-router";

const {
  get_SettingsObject,
  set_DailyLimit,
  set_SalaryMonthStart,
  set_StatisticSubjectCard,
} = useSettingsStore();

const walletStore = useWalletStore();

const currentSettings = get_SettingsObject();

const inputSalary = ref<number>(currentSettings.salaryMonthStart);
const inputLimit = ref<number>(currentSettings.dailyLimit);
const selectDailyLimitCard = ref<string | null>(
  currentSettings.statisticSubjectCard,
);

const isSalaryInputError = ref<boolean>(false);

const validateInput = (): boolean => {
  let isValid = false;

  if (Number(inputSalary.value) < 1 || Number(inputSalary.value) > 28) {
    isSalaryInputError.value = true;
  } else {
    isSalaryInputError.value = false;
    isValid = true;
  }

  return isValid;
};

const onInputFocus = (e: FocusEvent) => {
  if ((e.target as HTMLInputElement).id === "input-salary-month") {
    isSalaryInputError.value = false;
  }
};

const onHardUpdateApp = async () => {
  // 1. На всякий случай убиваем Service Worker (если он вдруг откуда-то взялся)
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
  }

  // 2. Очищаем хранилище кэшированных файлов браузера (НЕ localStorage!)
  if ("caches" in window) {
    const keys = await caches.keys();
    for (const key of keys) {
      await caches.delete(key);
    }
  }

  // 3. САМОЕ ГЛАВНОЕ ДЛЯ ЯРЛЫКОВ CHROME:
  // Перезагружаем страницу, добавляя к URL уникальный параметр.
  // Это заставит Chrome игнорировать старый кэш и скачать свежий index.html с сервера.
  const currentUrl = window.location.origin + window.location.pathname;
  const timeStamp = new Date().getTime();
  window.location.href = `${currentUrl}?v=${timeStamp}`;
};

const onSave = () => {
  if (!validateInput()) return;

  set_SalaryMonthStart(Number(inputSalary.value!));
  set_DailyLimit(Number(inputLimit.value!));
  set_StatisticSubjectCard(selectDailyLimitCard.value);

  onRouteStatisticsView();
};

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
@use "./options-view.scss" as *;
</style>
