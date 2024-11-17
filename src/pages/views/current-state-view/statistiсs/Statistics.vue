<template>
	<div class="statistics s">
		<header class="s__title-block">
			<h1 class="s__title">Statistics</h1>
			<div class="s__breadcrumbs breadcrumbs">
				<span class="breadcrumbs__link" @click="onRouteHome">Home</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__link" @click="onRouteCurrentState">Current state</span>
				<span class="breadcrumbs__divider">&nbsp;&nbsp;{{ breadcrumbsDivider }}&nbsp;&nbsp;</span>
				<span class="breadcrumbs__end">Statistic</span>
			</div>
		</header>

		<main class="s__main">
			<section class="s__main-subtitle sub">
				<div class="sub__period">
					<span class="sub__period-label">Period:</span>
					<span class="sub__period-date">{{ subtitle ? subtitle.period : '' }}</span>
				</div>
				<div class="sub__filters">
					<span>Filters:</span>
					<ul v-if="subtitle && subtitle.filters.length > 0">
						<li v-for="(item, i) in subtitle.filters" :key="i">
							{{ item }}{{ subtitle.filters.length - 1 === i ? '.' : ',' }}
						</li>
					</ul>
					<span v-else>no filters</span>
				</div>
			</section>
			<section class="s__main-chart"></section>
			<section class="s__main-info"></section>
			<section class="s__main-btns"></section>
		</main>

		<footer class="s__footer"></footer>
	</div>
</template>

<script setup lang="ts">
	import { useStatisticsStore } from '@/stores/statisticsStore';
	import type { IStatisticsSubtitle } from '@/models/types/cardTypes';

	definePage({
		name: 'statistics',
		path: '/statistics',
	});

	const statisticsStore = useStatisticsStore();

	const subtitle = ref<IStatisticsSubtitle>();

	onMounted(() => {
		subtitle.value = statisticsStore.get_StatisticsSubtitle;
	});

	const router = useRouter();
	const breadcrumbsDivider: string = '/';

	const onRouteCurrentState = () => {
		router.push('/current-state-view');
	};

	const onRouteHome = () => {
		router.push('/');
	};
</script>

<style scoped lang="scss">
	@import './statistics.scss';
</style>
