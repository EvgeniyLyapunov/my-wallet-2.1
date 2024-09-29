<template>
	<div>
		<v-dialog v-model="isShow" :persistent="true">
			<v-card class="modal">
				<v-card-title>
					<h2 class="modal__title">Create and Delete Tags</h2>
				</v-card-title>
				<v-card-text>
					<div class="modal__form">
						<FloatLabel class="modal__form-label-input">
							<InputText
								id="newTagInput"
								v-model="newTagName"
								class="modal__form-input"
								inputtext.border.radius="10"
							/>
							<label for="newTagInput">New Tag Name</label>
						</FloatLabel>
						<v-btn class="modal__form-btn" @click="onCreateNewTag">Ok</v-btn>
					</div>
					<div class="modal__tags">
						<TagItem
							v-for="(tag, i) in tagsList"
							:key="i"
							:tag="tag"
							:mode="'Delete'"
							@on-delete-tag="onDeleteTag"
						/>
					</div>
				</v-card-text>
				<div class="modal__footer">
					<div class="modal__footer-btns">
						<v-btn class="modal__footer-btn" @click="onCloseModal">Close</v-btn>
					</div>
				</div>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup lang="ts">
	import { useTagsStore } from '@/stores/tagsStore';
	import { nanoid } from 'nanoid';
	import TagItem from '@/pages/components/card-one-change-balance/TagItem.vue';
	import type { ITag } from '@/models/types/cardTypes';

	const emit = defineEmits<{
		'update:modelValue': [type: boolean];
	}>();

	const props = defineProps<{
		modelValue: boolean;
	}>();

	const isShow = computed({
		get() {
			return props.modelValue;
		},
		set(value) {
			emit('update:modelValue', value);
		},
	});

	watch(
		() => props.modelValue,
		(newvalue) => {
			if (newvalue) {
				tagsList.value = tagsStore.get_ChangeBalanceTagList();
			}
		}
	);

	const tagsStore = useTagsStore();
	const newTagName = ref<string>('');
	const tagsList = ref<ITag[]>([]);

	const onCreateNewTag = () => {
		if (!newTagName.value.trim()) {
			return;
		}
		const newTag: ITag = {
			Id: nanoid(),
			Name: newTagName.value.trim(),
		};
		tagsStore.addNewTag_ToChangeBalanceTagList(newTag);

		newTagName.value = '';
	};

	const onDeleteTag = (tag: ITag) => {
		tagsStore.delete_FromChangeBalanceTagList(tag);
		tagsList.value = tagsStore.get_ChangeBalanceTagList();
	};

	const onCloseModal = () => {
		newTagName.value = '';
		emit('update:modelValue', false);
	};
</script>

<style scoped lang="scss">
	@import './tag-edit-modal.scss';
</style>
