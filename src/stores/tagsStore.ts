import { defineStore } from 'pinia';
import Tag from '@/models/Tag';

export const useTagsStore = defineStore('tagsStore', () => {
	const changeBalanceTagsList = ref<Tag[]>([]);
	const statisticTagsList = ref<Tag[]>([]);

	const addNewTag_ToChangeBalanceTagList = (tag: Tag) => {
		changeBalanceTagsList.value.push(tag);
	};

	const addNewTag_StatisticTagsList = (tag: Tag) => {
		statisticTagsList.value.push(tag);
	};

	return {
		addNewTag_ToChangeBalanceTagList,
		addNewTag_StatisticTagsList,
	};
});
