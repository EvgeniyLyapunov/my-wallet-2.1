<template>
	<div class="current-state">
		<div class="current-state__title-block">
			<h1 class="current-state__title">Current state</h1>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePage({
		name: 'currentState_view',
		path: '/current-state-view',
	});
</script>

<style scoped lang="scss">
	@import './current-state-view.scss';
</style>
