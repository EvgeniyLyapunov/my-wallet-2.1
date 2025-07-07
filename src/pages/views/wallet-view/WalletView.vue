<template>
	<div class="wallet">
		<div class="wallet__title-block">
			<h1 class="wallet__title">Кошелёк</h1>
			<div class="wallet__breadcrumbs breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Домашняя</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">Кошелёк</span>
			</div>
		</div>
		<div class="wallet__menu">
			<router-link :to="{ name: 'cards_view' }" class="wallet__menu-link">
				<span class="wallet__menu-link-item">Карты</span>
			</router-link>

			<router-link :to="{ name: 'newCard_view' }" class="wallet__menu-link">
				<span class="wallet__menu-link-item">Новая карта</span>
			</router-link>

			<router-link :to="{ name: 'home_view' }" class="wallet__menu-link">
				<span class="wallet__menu-link-item">Домой</span>
			</router-link>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePage({
		name: 'wallet_view',
		path: '/wallet-view',
	});

	const router = useRouter();

	const breadcrumbsDivider: string = '/';

	const onRouteHome = () => {
		router.push('/');
	};
</script>

<style scoped lang="scss">
	@import './wallet-view.scss';
</style>
