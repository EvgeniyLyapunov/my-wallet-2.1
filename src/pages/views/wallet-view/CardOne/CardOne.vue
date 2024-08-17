<template>
	<div class="card">
		<div class="card__title-block">
			<h1 class="card__title">Cards</h1>
			<v-breadcrumbs class="card__under-title" :items="items"></v-breadcrumbs>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useRoute } from 'vue-router';
	import Card from '@/models/Card';
	import { nanoid } from 'nanoid';
	import { useWalletStore } from '@/stores/walletStore';

	type RequestCardIdParam = {
		id: string;
	};

	definePage({
		name: 'card-one_view',
		path: '/card-one-view/:id',
	});

	const router = useRouter();
	const route = useRoute();
	const id = ref<string>('');

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

	onMounted(() => {
		id.value = (route.params as RequestCardIdParam).id;
		console.log(id.value);
	});
</script>

<style scoped lang="scss">
	@import './card-one.scss';
</style>
