import type {
  IOperation,
  IStatisticOptions,
  ITag,
} from "@/models/types/cardTypes";
import { defineStore } from "pinia";
import { useWalletStore } from "@/stores/walletStore";
import { useStatisticsStore } from "@/stores/statisticsStore";
import { useSettingsStore } from "@/stores/settingsStore";
import dayjs from "dayjs";

export const useOperationsStore = defineStore(
  "operationsStore",
  () => {
    const { getCardId_ByName } = useWalletStore();
    const { get_CurrentSalaryMonthDate } = useStatisticsStore();
    const { settingsObject } = useSettingsStore();
    const operationsList = ref<IOperation[]>([]);
    let currentSelectedTag: ITag | undefined = undefined;
    let isCurrentSelectedExclusionTag: boolean = false;

    const getOperationsList = () => {
      const list = [...operationsList.value];
      return list;
    };

    const addOperationToList = (operation: IOperation) => {
      operationsList.value = [...operationsList.value, operation];
    };

    const get_OperationsByStatisticOptions = (
      optionsObj: IStatisticOptions,
    ): IOperation[] => {
      const from = dayjs.tz(optionsObj.from).startOf("minute");
      const to = dayjs.tz();
      let resultList: IOperation[];
      resultList = operationsList.value.filter((item, i) => {
        const operationDate = dayjs.tz(item.date);
        if (!operationDate.isBefore(from) && !operationDate.isAfter(to)) {
          return true;
        }
      });

      if (optionsObj.card) {
        resultList = resultList.filter((item) => {
          const cardId = getCardId_ByName(optionsObj.card!);
          if (item.cardId === cardId) {
            return true;
          }
        });
      }

      if (optionsObj.operationType) {
        resultList = resultList.filter(
          (item) => item.type === optionsObj.operationType,
        );
      }

      if (optionsObj.moneyType) {
        resultList = resultList.filter(
          (item) => item.moneyType === optionsObj.moneyType,
        );
      }

      if (optionsObj.tags.length > 0) {
        resultList = resultList.filter((item) => {
          if (!item.tag) return false;
          if (optionsObj.tags.some((tag) => tag.Id === item.tag)) return true;
        });
      }
      return resultList;
    };

    const cleanOperationsDeletedCard = (id: string) => {
      const list = operationsList.value.filter((item) => item.cardId !== id);
      operationsList.value = [...list];
    };

    const delete_lastOperation = () => {
      operationsList.value.pop();
    };

    const delete_TodayOperations = () => {
      operationsList.value = operationsList.value.filter(
        (item) => dayjs(item.date).date() !== dayjs().date(),
      );
    };

    const delete_BeforeCurrentMonthOperations = () => {
      const firstDayTimestamp = dayjs().startOf("month").valueOf();

      operationsList.value = operationsList.value.filter(
        (item) => dayjs(item.date).valueOf() >= firstDayTimestamp,
      );
    };

    const delete_BeforeCurrentSalaryMonthOperations = () => {
      const firstDayTimestamp = get_CurrentSalaryMonthDate().getTime();
      operationsList.value = operationsList.value.filter(
        (item) => dayjs(item.date).valueOf() >= firstDayTimestamp,
      );
    };

    const delete_AllOperations = () => {
      operationsList.value = [];
    };

    const deleteAllOperations_ByTagId = (id: string) => {
      operationsList.value = operationsList.value.filter(
        (o) => o.tag === undefined || o.tag !== id,
      );
    };

    const get_operationsByPeriod = (start: Date) => {
      const from = dayjs.tz(start).startOf("minute");
      const to = dayjs.tz();
      let resultList: IOperation[];
      resultList = operationsList.value.filter((item, i) => {
        const operationDate = dayjs.tz(item.date);
        if (!operationDate.isBefore(from) && !operationDate.isAfter(to)) {
          return true;
        }
      });

      if (settingsObject.statisticSubjectCard) {
        resultList = resultList.filter(
          (item) => item.cardId === settingsObject.statisticSubjectCard,
        );
      }
      return resultList;
    };

    const get_CurrentSelectedTag = () => {
      return currentSelectedTag;
    };

    const set_CurrentSelectedTag = (tag: ITag) => {
      currentSelectedTag = tag;
    };

    const reset_CurrentSelectedTag = () => {
      currentSelectedTag = undefined;
    };

    const get_IsCurrentSelectedExclusionTag = () => {
      return isCurrentSelectedExclusionTag;
    };

    const set_IsCurrentSelectedExclusionTag = (flag: boolean) => {
      isCurrentSelectedExclusionTag = flag;
    };

    return {
      getOperationsList,
      operationsList,
      addOperationToList,
      get_OperationsByStatisticOptions,
      cleanOperationsDeletedCard,
      delete_lastOperation,
      delete_TodayOperations,
      delete_BeforeCurrentMonthOperations,
      delete_BeforeCurrentSalaryMonthOperations,
      delete_AllOperations,
      deleteAllOperations_ByTagId,

      get_operationsByPeriod,

      get_CurrentSelectedTag,
      set_CurrentSelectedTag,
      reset_CurrentSelectedTag,
      get_IsCurrentSelectedExclusionTag,
      set_IsCurrentSelectedExclusionTag,
    };
  },
  {
    persist: true,
  },
);
