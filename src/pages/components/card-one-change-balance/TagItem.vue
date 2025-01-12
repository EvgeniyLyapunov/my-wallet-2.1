<template>
	<div
		:class="{ tag: true, 'tag-delete': props.mode === 'Delete', tag_selected: isSelected }"
		@click="onTagTap"
	>
		<span class="tag__name">{{ props.tag.Name }}</span>
		<v-btn
			v-show="props.mode === 'Delete'"
			class="tag__delbtn"
			variant="text"
			icon="mdi-delete"
			@click="onTagDelete"
		></v-btn>
	</div>
</template>

<script setup lang="ts">
	import type { ITag } from '@/models/types/cardTypes';
	const props = defineProps<{
		tag: ITag;
		mode: 'Operation' | 'Delete';
	}>();

	const emit = defineEmits<{
		onAddTag: [type: ITag];
		onCancelTag: [type: ITag];
		onDeleteTag: [type: ITag];
		tagFromOptionStatistics: [type: () => ITag];
	}>();

	const isSelected = ref<boolean>(false);

	onMounted(() => {
		emit('tagFromOptionStatistics', selectFromStatisticOptions);
	});

	const onTagTap = () => {
		if (props.mode === 'Delete') {
			return;
		}

		if (isSelected.value) {
			emit('onCancelTag', props.tag);
			isSelected.value = false;
		} else {
			emit('onAddTag', props.tag);
			isSelected.value = true;
		}
	};

	function selectFromStatisticOptions() {
		isSelected.value = true;
		return props.tag;
	}

	const onTagDelete = () => {
		emit('onDeleteTag', props.tag);
	};
</script>

<style scoped lang="scss">
	@import './tag-item.scss';
</style>
