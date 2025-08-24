import { defineStore } from 'pinia';
import type { ITag } from '@/models/types/cardTypes';
import { useOperationsStore } from '@/stores/operationsStore';

export const useTagsStore = defineStore(
	'tagsStore',
	() => {
		const tagsList = ref<ITag[]>([
			{
				Id: '###',
				Name: '###',
				Color: '###',
			},
		]);

		const statisticTagsList = ref<ITag[]>([
			{
				Id: '###',
				Name: '###',
				Color: '###',
			},
		]);

		const regularTagsColor = ref<string[]>([
			'#ff0000',
			'#0aff99',
			'#ff8700',
			'#0aefff',
			'#ffd300',
			'#147df5',
			'#deff0a',
			'#580aff',
			'#a1ff0a',
			'#be0aff',
		]);

		const { getOperationsList, deleteAllOperations_ByTagId } = useOperationsStore();

		// обновление актуальности тегов для статистики
		const refreshStatisticsTags = () => {
			const operationsList = getOperationsList();
			const uniqeTagsId = new Set<string>();
			operationsList.forEach((o) => {
				if (!o.tag || o.tag === '###') return;
				uniqeTagsId.add(o.tag!);
			});

			const tags: ITag[] = [
				{
					Id: '###',
					Name: '###',
					Color: '###',
				},
			];

			const uniqe = Array.from(uniqeTagsId);

			uniqe.forEach((t) => {
				const tag = get_TagFromTagsList(t);
				tags.push(tag!);
			});

			statisticTagsList.value = tags;
		};

		const checkForUniqueTagIn_TagsList = (tag: ITag): boolean => {
			return tagsList.value.some((item) => item.Name === tag.Name);
		};

		const addNewTag_ToTagsList = (tag: ITag) => {
			tagsList.value.push(tag);
			tagsList.value.forEach((tag, index) => {
				if (tag.Id === '###') tag.Color = '###';
				tag.Color = regularTagsColor.value[index];
			});
		};

		const setActualTagFirst = (id: string) => {
			const activeTagIndex = tagsList.value.findIndex((t) => t.Id === id);
			if (activeTagIndex === -1 || activeTagIndex === 1 || tagsList.value.length < 2) {
				return;
			}
			const [item] = tagsList.value.splice(activeTagIndex, 1);
			tagsList.value.splice(1, 0, item);
		};

		const get_TagFromTagsList = (tagId: string): ITag | undefined => {
			if (tagsList.value.some((item) => item.Id === tagId)) {
				return tagsList.value.filter((item) => item.Id === tagId)[0];
			} else {
				return undefined;
			}
		};

		const get_TagName_FromTagsList_ById = (id: string): string => {
			if (tagsList.value.find((item) => item.Id === id)) {
				return tagsList.value.find((item) => item.Id === id)!.Name;
			} else {
				return '';
			}
		};

		const get_TagsList = () => {
			return tagsList.value;
		};

		const delete_FromTagsList = (tag: ITag) => {
			console.log(tag);
			deleteAllOperations_ByTagId(tag.Id);
			tagsList.value = tagsList.value.filter((item) => item.Id != tag.Id);
			tagsList.value.forEach((tag, index) => {
				if (tag.Id === '###') tag.Color = '###';
				tag.Color = regularTagsColor.value[index];
			});
		};

		const checkForUniqueTagIn_StatisticTagsList = (tag: ITag): boolean => {
			return statisticTagsList.value.some((item) => item.Name === tag.Name);
		};

		const addNewTag_StatisticTagsList = (tag: ITag) => {
			let index = tagsList.value.length;
			if (index >= 10) index = index % 10;
			tag.Color = regularTagsColor.value[index];
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
			tagsList,
			statisticTagsList,
			checkForUniqueTagIn_TagsList,
			addNewTag_ToTagsList,
			setActualTagFirst,
			checkForUniqueTagIn_StatisticTagsList,
			addNewTag_StatisticTagsList,
			get_TagsList,
			get_TagFromTagsList,
			get_TagName_FromTagsList_ById,
			refreshStatisticsTags,
			get_StatisticTagsList,
			get_TagFromStatisticTagsList,
			delete_FromTagsList,
			delete_FromStatisticTagsList,
		};
	},
	{
		persist: true,
	}
);
