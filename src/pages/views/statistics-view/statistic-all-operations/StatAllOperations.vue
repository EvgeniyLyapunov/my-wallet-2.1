<template>
	<div class="stat-all">
		<div class="stat-all__title-block">
			<h1 class="stat-all__title">Движение средств</h1>
			<div class="breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Домашняя</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__link" @click="onRouteStatisticsView">Статистика</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">Движение средств</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePage({
		name: 'stat-all-operations',
		path: '/stat-all-operations',
	});

	const router = useRouter();
	const breadcrumbsDivider: string = '/';

	const onRouteStatisticsView = () => {
		router.push('/statistics-view');
	};

	const onRouteHome = () => {
		router.push('/');
	};
</script>

<style scoped lang="scss">
	@import './stat-all-operations.scss';
</style>
