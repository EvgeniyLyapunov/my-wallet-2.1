<template>
	<div class="cards">
		<div class="cards__title-block">
			<h1 class="cards__title">Cards</h1>
			<v-breadcrumbs class="cards__under-title" :items="items"></v-breadcrumbs>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePage({
		name: 'cards_view',
		path: '/cards-view',
	});

	const items = [
		{
			title: 'Home',
			disabled: false,
			href: '/',
		},
		{
			title: 'Wallet',
			disabled: false,
			href: '/wallet-view',
		},
		{
			title: 'Cards',
			disabled: true,
			href: '/cards-view',
		},
	];
</script>

<style scoped lang="scss">
	@import './cards.scss';
</style>
