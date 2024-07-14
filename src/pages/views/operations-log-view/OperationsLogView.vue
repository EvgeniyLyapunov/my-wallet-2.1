<template>
	<div class="operations-log">
		<div class="operations-log__title-block">
			<h1 class="operations-log__title">Operations log</h1>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePage({
		name: 'operationsLog_view',
		path: '/operations-log-view',
	});
</script>

<style scoped lang="scss">
	@import './operations-log-view.scss';
</style>
