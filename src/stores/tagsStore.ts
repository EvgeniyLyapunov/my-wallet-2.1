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

		const delete_FromChangeBalanceTagList = (tag: Tag) => {
			changeBalanceTagsList.value = changeBalanceTagsList.value.filter((item) => item.Id != tag.Id);
		};

		const addNewTag_StatisticTagsList = (tag: Tag) => {
			statisticTagsList.value.push(tag);
		};

		const get_StatisticTagsList = () => {
			return statisticTagsList.value;
		};

		const delete_FromStatisticTagsList = (tag: Tag) => {
			statisticTagsList.value = statisticTagsList.value.filter((item) => item.Id != tag.Id);
		};

		return {
			changeBalanceTagsList,
			statisticTagsList,
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
