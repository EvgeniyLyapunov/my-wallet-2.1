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
	import { useOperationsStore } from '@/stores/operationsStore';
	const props = defineProps<{
		tag: ITag;
		mode: 'Operation' | 'Delete';
	}>();

	const emit = defineEmits<{
		onDeleteTag: [type: ITag];
		tagFromOptionStatistics: [type: () => ITag];
	}>();

	const { get_CurrentSelectedTag, reset_CurrentSelectedTag, set_CurrentSelectedTag } =
		useOperationsStore();

	const isSelected = ref<boolean>(false);

	onMounted(() => {
		emit('tagFromOptionStatistics', selectFromStatisticOptions);
	});

	const onTagTap = () => {
		if (props.mode === 'Delete') {
			return;
		}

		if (get_CurrentSelectedTag() && get_CurrentSelectedTag()!.Id !== props.tag.Id) {
			return;
		}

		if (!get_CurrentSelectedTag()) {
			set_CurrentSelectedTag(props.tag);
			isSelected.value = true;
			return;
		}

		if (get_CurrentSelectedTag() && get_CurrentSelectedTag()!.Id === props.tag.Id) {
			reset_CurrentSelectedTag();
			isSelected.value = false;
			return;
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
