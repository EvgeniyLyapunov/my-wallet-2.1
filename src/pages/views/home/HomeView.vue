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
				<span class="home__menu-link-item">Statistics</span>
			</router-link>

			<router-link :to="{ name: 'operationsLog_view' }" class="home__menu-link">
				<span class="home__menu-link-item">Operation Log</span>
			</router-link>

			<!-- <div class="home__menu-link">
				<v-btn @click="onClearStorage">Clear Storage</v-btn>
			</div> -->

			<!-- <div class="home__menu-link">
				<v-btn prepend-icon="mdi-map-marker-radius" @click="onOpenGpsModal">GPS Test</v-btn>
			</div>
			<div class="home__menu-link">
				<v-btn prepend-icon="mdi-camera" @click="onOpenPhotoModal">Photo Test</v-btn>
			</div> -->
		</div>
		<div class="home__footer">
			<span class="home__footer-copy">Copyright &copy;</span>
			<span class="home__footer-logo"></span>
		</div>
	</div>

	<gps-modal v-model="isGpsModalVisible" />
	<PhotoModal v-model="isPhotoModalVisible" />
</template>

<script setup lang="ts">
	import GpsModal from '@/pages/components/gps-modal/GpsModal.vue';
	import PhotoModal from '@/pages/components/photo-modal/PhotoModal.vue';
	definePage({
		name: 'home_view',
		path: '/',
	});

	const onClearStorage = () => {
		localStorage.clear();
	};

	const isGpsModalVisible = ref<boolean>(false);
	const isPhotoModalVisible = ref<boolean>(false);

	const onOpenGpsModal = () => {
		isGpsModalVisible.value = true;
	};

	const onOpenPhotoModal = () => {
		isPhotoModalVisible.value = true;
	};
</script>

<style scoped lang="scss">
	@import './home-view.scss';
</style>
