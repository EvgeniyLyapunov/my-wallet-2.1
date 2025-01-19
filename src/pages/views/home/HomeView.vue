<template>
	<div class="home">
		<div class="home__title-block">
			<h1 class="home__title">My Wallet 2.1</h1>
			<span class="home__under-title">by little wing studio</span>
		</div>
		<div class="home__menu">
			<router-link :to="{ name: 'wallet_view' }" class="home__menu-link">
				<span class="home__menu-link-item">Wallet</span>
			</router-link>

			<router-link :to="{ name: 'currentState_view' }" class="home__menu-link">
				<span class="home__menu-link-item">Current State</span>
			</router-link>

			<router-link :to="{ name: 'operationsLog_view' }" class="home__menu-link">
				<span class="home__menu-link-item">Operation Log</span>
			</router-link>

			<!-- <div class="home__menu-link">
				<v-btn @click="onClearStorage">Clear Storage</v-btn>
			</div> -->
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

	const onClearStorage = () => {
		localStorage.clear();
	};
</script>

<style scoped lang="scss">
	@import './home-view.scss';
</style>
