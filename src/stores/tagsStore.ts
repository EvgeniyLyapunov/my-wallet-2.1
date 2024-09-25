import { defineStore } from 'pinia';
import Tag from '@/models/Tag';

export const useTagsStore = defineStore(
	'tagsStore',
	() => {
		const changeBalanceTagsList = ref<Tag[]>([]);
		const statisticTagsList = ref<Tag[]>([]);

		const addNewTag_ToChangeBalanceTagList = (tag: Tag) => {
			changeBalanceTagsList.value.push(tag);
		};

		const get_ChangeBalanceTagList = () => {
			return changeBalanceTagsList.value;
		};

		const addNewTag_StatisticTagsList = (tag: Tag) => {
			statisticTagsList.value.push(tag);
		};

		const get_StatisticTagsList = () => {
			return statisticTagsList.value;
		};

		return {
			changeBalanceTagsList,
			statisticTagsList,
			addNewTag_ToChangeBalanceTagList,
			addNewTag_StatisticTagsList,
			get_ChangeBalanceTagList,
			get_StatisticTagsList,
		};
	},
	{
		persist: true,
	}
);