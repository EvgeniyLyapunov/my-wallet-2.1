<template>
	<div>
		<v-dialog v-model="isShow" :persistent="true">
			<v-card class="modal">
				<v-card-title>
					<h2 class="modal__title">Create and Delete Tags</h2>
				</v-card-title>
				<v-card-text class="modal__form"> </v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup lang="ts">
	import { useTagsStore } from '@/stores/tagsStore';

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

	const tagsStore = useTagsStore();
</script>

<style scoped lang="scss">
	@import './tag-edit-modal.scss';
</style>
