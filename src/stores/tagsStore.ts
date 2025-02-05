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

		const get_TagFromChangeBalanceTagsList = (tagId: string): ITag | undefined => {
			if (changeBalanceTagsList.value.some((item) => item.Id === tagId)) {
				return changeBalanceTagsList.value.filter((item) => item.Id === tagId)[0];
			} else {
				return undefined;
			}
		};

		const get_TagName_FromChangeBalanceTagsList_ById = (id: string): string => {
			if (changeBalanceTagsList.value.find((item) => item.Id === id)) {
				return changeBalanceTagsList.value.find((item) => item.Id === id)!.Name;
			} else {
				return '';
			}
		};

		const get_ChangeBalanceTagList = () => {
			return changeBalanceTagsList.value;
		};

		const delete_FromChangeBalanceTagList = (tag: ITag) => {
			changeBalanceTagsList.value = changeBalanceTagsList.value.filter((item) => item.Id != tag.Id);
		};

		const checkForUniqueTagIn_StatisticTagsList = (tag: ITag): boolean => {
			return statisticTagsList.value.some((item) => item.Name === tag.Name);
		};

		const addNewTag_StatisticTagsList = (tag: ITag) => {
			statisticTagsList.value.push(tag);
		};

		const get_StatisticTagsList = () => {
			return statisticTagsList.value;
		};

		const get_TagFromStatisticTagsList = (tagId: string): ITag | undefined => {
			if (statisticTagsList.value.some((item) => item.Id === tagId)) {
				return statisticTagsList.value.filter((item) => item.Id === tagId)[0];
			} else {
				return undefined;
			}
		};

		const delete_FromStatisticTagsList = (tag: ITag) => {
			statisticTagsList.value = statisticTagsList.value.filter((item) => item.Id != tag.Id);
		};

		return {
			changeBalanceTagsList,
			statisticTagsList,
			checkForUniqueTagIn_ChangeBalanceList,
			addNewTag_ToChangeBalanceTagList,
			checkForUniqueTagIn_StatisticTagsList,
			addNewTag_StatisticTagsList,
			get_ChangeBalanceTagList,
			get_TagFromChangeBalanceTagsList,
			get_TagName_FromChangeBalanceTagsList_ById,
			get_StatisticTagsList,
			get_TagFromStatisticTagsList,
			delete_FromChangeBalanceTagList,
			delete_FromStatisticTagsList,
		};
	},
	{
		persist: true,
	}
);
