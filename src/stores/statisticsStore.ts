import { defineStore } from "pinia";
import { useSettingsStore } from "@/stores/settingsStore";
import type {
  ITag,
  IStatisticOptions,
  ICard,
  TCardMoney,
  TOperationType,
  IStatisticsSubtitle,
  StatisticsPeriodType,
  IStatisticsResume,
  IStatOptions,
} from "@/models/types/cardTypes";
import dayjs, { type ConfigType } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const useStatisticsStore = defineStore("statisticsStore", () => {
  const { get_SettingsObject } = useSettingsStore();

  const statisticOptions = reactive<IStatisticOptions>({
    from: dayjs().tz().startOf("day").toDate(),
    to: dayjs().tz().toDate(),
    periodType: "Today",
    card: undefined,
    moneyType: undefined,
    operationType: undefined,
    tags: [],
  });

  const get_StatisticsSubtitle = () => {
    const subtitle: IStatisticsSubtitle = {
      period: statisticOptions.periodType,
      filters: [],
    };

    if (statisticOptions.card) {
      subtitle.filters.push("Card");
    }

    if (statisticOptions.moneyType) {
      subtitle.filters.push("MoneyType");
    }

    if (statisticOptions.operationType) {
      subtitle.filters.push("OperationType");
    }

    if (statisticOptions.tags.length > 0) {
      subtitle.filters.push("Tags");
    }

    return subtitle;
  };

  const get_StatisticOptions = (): IStatisticOptions => {
    return statisticOptions;
  };

  const set_StatisticPeriod = (period: StatisticsPeriodType) => {
    statisticOptions.periodType = period;
    statAllPeriodOption.periodType = period;
    initPeriodDates(period);
  };

  const set_FromDate = (from: Date) => {
    statisticOptions.from = from;
    statAllPeriodOption.from = from;
    statAllPeriodOption.changesDateTime = dayjs.tz().startOf("minute").toDate();
  };

  const set_ToDate = (to: Date) => {
    statisticOptions.to = to;
    statAllPeriodOption.to = to;
  };

  const set_Card = (cardName: string) => {
    if (cardName === "All") {
      statisticOptions.card = undefined;
    } else {
      statisticOptions.card = cardName;
    }
  };

  const set_MoneyType = (type: TCardMoney | "All") => {
    if (type === "All") {
      statisticOptions.moneyType = undefined;
    } else {
      statisticOptions.moneyType = type;
    }
  };

  const set_operationType = (type: TOperationType | "All") => {
    if (type === "All") {
      statisticOptions.operationType = undefined;
    } else {
      statisticOptions.operationType = type;
    }
  };

  const set_Tags = (tags: ITag[]) => {
    statisticOptions.tags = tags;
  };

  const statAllPeriodOption = reactive<IStatOptions>({
    from: dayjs().tz().startOf("day").toDate(),
    to: dayjs().tz().toDate(),
    periodType: "Today",
    changesDateTime: null,
  });

  const get_StatAllPeriodOption = (): IStatOptions => {
    const lastChanged = dayjs(statAllPeriodOption.changesDateTime);
    if (
      isMoreThanOneHourAgo(lastChanged) ||
      statAllPeriodOption.changesDateTime === null
    ) {
      statAllPeriodOption.from = get_CurrentSalaryMonthDate();
      statAllPeriodOption.to = dayjs().tz().toDate();
      ((statAllPeriodOption.periodType = "Salary Month"),
        (statAllPeriodOption.changesDateTime = null));
    }
    return statAllPeriodOption;
  };

  /**
   * Функция для проверки, была ли дата более часа назад.
   * @param {dayjs.Moment} date - Дата для проверки (объект moment).
   * @returns {boolean} - true, если дата была более часа назад, иначе false.
   */
  function isMoreThanOneHourAgo(date: ConfigType) {
    // Пороговое значение: текущее время минус один час
    const oneHourAgo = dayjs().tz().subtract(1, "hour");

    // Проверяем, находится ли наша дата до этого порогового значения
    return dayjs(date).isBefore(oneHourAgo);
  }

  const initPeriodDates = (period: StatisticsPeriodType) => {
    switch (period) {
      case "Today":
        set_FromDate(dayjs().startOf("day").toDate());
        break;
      case "Current Week":
        set_FromDate(dayjs().startOf("week").toDate());
        break;
      case "Current Month":
        set_FromDate(dayjs().startOf("month").toDate());
        break;
      case "Salary Month":
        set_FromDate(get_CurrentSalaryMonthDate());
        break;
    }
    set_ToDate(dayjs().tz().startOf("minute").toDate());
  };

  const get_CurrentSalaryMonthDate = () => {
    const currentDay = dayjs().date();
    let currentSalaryMonthDate = dayjs().toDate();

    if (currentDay >= get_SettingsObject().salaryMonthStart) {
      // Если текущий день больше или равен числу начала фин месяца, получаем дату этого месяца
      currentSalaryMonthDate = dayjs()
        .date(get_SettingsObject().salaryMonthStart)
        .startOf("day")
        .toDate();
    } else {
      // Если текущий день меньше числа начала фин месяца, получаем дату прошлого месяца
      currentSalaryMonthDate = dayjs()
        .subtract(1, "months")
        .date(get_SettingsObject().salaryMonthStart)
        .startOf("day")
        .toDate();
    }
    return currentSalaryMonthDate;
  };

  return {
    statisticOptions,
    get_StatisticsSubtitle,
    get_StatisticOptions,
    set_StatisticPeriod,
    set_FromDate,
    set_ToDate,
    set_Card,
    set_MoneyType,
    set_operationType,
    set_Tags,

    statAllPeriodOption,
    get_StatAllPeriodOption,
    get_CurrentSalaryMonthDate,
  };
});
