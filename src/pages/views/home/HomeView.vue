<template>
	<div class="home">
		<div class="home__title-block">
			<h1 class="home__title">My Wallet 2.1</h1>
			<span class="home__under-title">by little wing studio</span>
		</div>
		<div class="home__menu">
			<router-link :to="{ name: 'wallet_view' }" class="home__menu-link">
				<span class="home__menu-link-item">Кошелёк</span>
			</router-link>

			<router-link :to="{ name: 'balance_view' }" class="home__menu-link">
				<span class="home__menu-link-item">Баланс</span>
			</router-link>

			<router-link :to="{ name: 'statistics_view' }" class="home__menu-link">
				<span class="home__menu-link-item">Статистика</span>
			</router-link>

			<router-link :to="{ name: 'operationsLog_view' }" class="home__menu-link">
				<span class="home__menu-link-item">Журнал операций</span>
			</router-link>

			<router-link :to="{ name: 'operationsLog_view' }" class="home__menu-link">
				<span class="home__menu-link-item">Планы покупок</span>
			</router-link>
		</div>
		<div class="home__footer">
			<span class="home__footer-copy">Copyright &copy;</span>
			<span class="home__footer-logo"></span>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePage({
		name: 'home_view',
		path: '/',
	});

	const isGpsModalVisible = ref<boolean>(false);
	const isPhotoModalVisible = ref<boolean>(false);
</script>

<style scoped lang="scss">
	@import './home-view.scss';
</style>
