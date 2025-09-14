<template>
	<div :class="{ 'olc-panel': true, 'element-hidden': !isPanelVisible }">
		<div class="olc-panel__field">
			<span class="olc-panel__field-label">Последняя операция</span>
			<v-btn class="olc-panel__field-btn" @click="onDeleteLastOperation">
				<v-icon>mdi-delete</v-icon>
			</v-btn>
		</div>
		<div class="olc-panel__field">
			<span class="olc-panel__field-label">Текущий день</span>
			<v-btn class="olc-panel__field-btn" @click="onDeleteTodayOperations">
				<v-icon>mdi-delete</v-icon>
			</v-btn>
		</div>
		<div class="olc-panel__field">
			<span class="olc-panel__field-label">До текущего месяца</span>
			<v-btn class="olc-panel__field-btn" @click="onDeleteBeforeCurrentMonth">
				<v-icon>mdi-delete</v-icon>
			</v-btn>
		</div>
		<div class="olc-panel__field">
			<span class="olc-panel__field-label">До текущего фин.месяца</span>
			<v-btn class="olc-panel__field-btn" @click="onDeleteBeforeCurrentSalaryMonth">
				<v-icon>mdi-delete</v-icon>
			</v-btn>
		</div>
		<div class="olc-panel__field">
			<span class="olc-panel__field-label">Все операции</span>
			<v-btn class="olc-panel__field-btn" @click="onDeleteAll">
				<v-icon>mdi-delete</v-icon>
			</v-btn>
		</div>
		<div class="olc-panel__actives">
			<v-btn class="olc-panel__button" @click="onPanelClose">Закрыть</v-btn>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { DeletePointType } from '@/models/types/cardTypes';

	const props = defineProps<{
		isShow: boolean;
	}>();

	const emit = defineEmits<{
		toggleVisible: [type: boolean];
		deletePointSelect: [type: DeletePointType];
	}>();

	const isPanelVisible = computed({
		get() {
			return props.isShow;
		},
		set(value) {
			emit('toggleVisible', value);
		},
	});

	const onDeleteLastOperation = () => {
		emit('toggleVisible', false);
		emit('deletePointSelect', 'lastOperation');
	};

	const onDeleteTodayOperations = () => {
		emit('toggleVisible', false);
		emit('deletePointSelect', 'today');
	};

	const onDeleteBeforeCurrentMonth = () => {
		emit('toggleVisible', false);
		emit('deletePointSelect', 'beforeCurrentMonth');
	};

	const onDeleteBeforeCurrentSalaryMonth = () => {
		emit('toggleVisible', false);
		emit('deletePointSelect', 'beforeCurentSalaryMonth');
	};

	const onDeleteAll = () => {
		emit('toggleVisible', false);
		emit('deletePointSelect', 'all');
	};

	const onPanelClose = () => {
		emit('toggleVisible', false);
	};
</script>

<style scoped lang="scss">
	@use './operations-log-controls-panel.scss' as *;
</style>
