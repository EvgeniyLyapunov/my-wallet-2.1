import { defineStore } from 'pinia';
import type { ITag } from '@/models/types/cardTypes';

export const useTagsStore = defineStore(
	'tagsStore',
	() => {
		const changeBalanceTagsList = ref<ITag[]>([]);
		const statisticTagsList = ref<ITag[]>([]);

		const checkForUniqueTagIn_ChangeBalanceList = (tag: ITag): boolean => {
			return changeBalanceTagsList.value.some((item) => item.Name === tag.Name);
		};

		const addNewTag_ToChangeBalanceTagList = (tag: ITag) => {
			changeBalanceTagsList.value.push(tag);
		};

		const get_ChangeBalanceTagList = () => {
			return changeBalanceTagsList.value;
		};

		const delete_FromChangeBalanceTagList = (tag: ITag) => {
			changeBalanceTagsList.value = changeBalanceTagsList.value.filter((item) => item.Id != tag.Id);
		};

		const addNewTag_StatisticTagsList = (tag: ITag) => {
			statisticTagsList.value.push(tag);
		};

		const get_StatisticTagsList = () => {
			return statisticTagsList.value;
		};

		const delete_FromStatisticTagsList = (tag: ITag) => {
			statisticTagsList.value = statisticTagsList.value.filter((item) => item.Id != tag.Id);
		};

		return {
			changeBalanceTagsList,
			statisticTagsList,
			checkForUniqueTagIn_ChangeBalanceList,
			addNewTag_ToChangeBalanceTagList,
			addNewTag_StatisticTagsList,
			get_ChangeBalanceTagList,
			get_StatisticTagsList,
			delete_FromChangeBalanceTagList,
			delete_FromStatisticTagsList,
		};
	},
	{
		persist: true,
	}
);
