<template>
	<div class="card-obj">
		<img class="card-obj__img" :src="props.cardIcon" />
		<span class="card-obj__name">{{ props.cardName }}</span>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps<{
		cardName: string;
		cardIcon: string;
	}>();
</script>

<style scoped lang="scss">
	@import './card-object-component.scss';
</style>
