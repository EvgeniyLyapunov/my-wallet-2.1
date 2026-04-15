import { defineStore } from "pinia";
import type { DailyLimitPeriodType, ISettings } from "@/models/types/cardTypes";

export const useSettingsStore = defineStore(
  "settingsStore",
  () => {
    const settingsObject = reactive<ISettings>({
      isSaveLastStatisticOptions: true,
      salaryMonthStart: 10,
      dailyLimit: 1000,
      dailyLimitPeriod: "Salary Month",
      statisticSubjectCard: null,
    });

    const get_SettingsObject = () => {
      return settingsObject;
    };

    const set_SalaryMonthStart = (num: number) => {
      settingsObject.salaryMonthStart = num;
    };

    const set_DailyLimit = (num: number) => {
      settingsObject.dailyLimit = num;
    };

    const set_DailyLimitPeriod = (period: DailyLimitPeriodType) => {
      settingsObject.dailyLimitPeriod = period;
    };

    const set_StatisticSubjectCard = (card: string | null) => {
      settingsObject.statisticSubjectCard = card;
    };

    return {
      settingsObject,
      get_SettingsObject,
      set_SalaryMonthStart,
      set_DailyLimit,
      set_DailyLimitPeriod,
      set_StatisticSubjectCard,
    };
  },
  {
    persist: true,
  },
);
