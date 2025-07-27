<template>
	<div class="operation-log-item ol-i">
		<div v-if="isDate" class="ol-i__date date">
			<span class="date__value">{{ props.logItem }}</span>
		</div>
		<div v-else class="ol-i__operation operation">
			<div class="operation__type">
				<span class="operation__type-value">{{ (props.logItem as IOperation).type }}</span>
			</div>
			<div class="operation__info">
				<div class="operation__info-points">
					<span class="operation__info-points-name">{{ cardName }}</span>
					<span class="operation__info-points-moneytype">{{
						(props.logItem as IOperation).moneyType
					}}</span>
					<span class="operation__info-points-amount">{{
						(props.logItem as IOperation).amount
					}}</span>
				</div>
				<div v-if="(props.logItem as IOperation).tag" class="operation__info-tags">
					<span class="operation__info-tags-label">tag:</span>
					<span class="operation__info-tags-value">{{ tag }}</span>
					<span
						v-if="(props.logItem as IOperation).exclusionTag"
						class="operation__info-tags-value_exclusion"
						>&nbsp;###</span
					>
				</div>
				<div v-else class="operation__info-tags-empty"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { IOperation } from '@/models/types/cardTypes';
	import { useWalletStore } from '@/stores/walletStore';
	import { useTagsStore } from '@/stores/tagsStore';

	const props = defineProps<{
		logItem: string | IOperation;
	}>();

	const { getCardName_ById } = useWalletStore();
	const { get_TagName_FromChangeBalanceTagsList_ById } = useTagsStore();

	const isDate = computed<boolean>(() => typeof props.logItem === 'string');
	const cardName = ref<string | undefined>('');
	const tag = ref<string>('');

	onMounted(() => {
		if (!isDate.value) {
			cardName.value = getCardName_ById((props.logItem as IOperation).cardId);
			if ((props.logItem as IOperation).tag) {
				tag.value = get_TagName_FromChangeBalanceTagsList_ById((props.logItem as IOperation).tag!);
			}
		}
	});
</script>

<style scoped lang="scss">
	@import './operation-log-item.scss';
</style>
