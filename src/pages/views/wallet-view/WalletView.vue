<template>
	<div class="wallet">
		<div class="wallet__title-block">
			<h1 class="wallet__title">Wallet</h1>
			<v-breadcrumbs class="wallet__under-title" :items="items"></v-breadcrumbs>
		</div>
		<div class="wallet__menu">
			<router-link :to="{ name: 'cards_view' }" class="wallet__menu-link">
				<span class="wallet__menu-link-item">Cards</span>
			</router-link>

			<router-link :to="{ name: 'newCard_view' }" class="wallet__menu-link">
				<span class="wallet__menu-link-item">New card</span>
			</router-link>

			<router-link :to="{ name: 'home_view' }" class="wallet__menu-link">
				<span class="wallet__menu-link-item">Home</span>
			</router-link>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePage({
		name: 'wallet_view',
		path: '/wallet-view',
	});

	const items = [
		{
			title: 'Home',
			disabled: false,
			href: '/',
		},
		{
			title: 'Wallet',
			disabled: true,
			href: '/wallet-view',
		},
	];
</script>

<style scoped lang="scss">
	@import './wallet-view.scss';
</style>
