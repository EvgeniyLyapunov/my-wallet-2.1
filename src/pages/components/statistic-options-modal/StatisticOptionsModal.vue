<template>
	<div>
		<v-dialog v-model="isShow" :persistent="true">
			<v-card class="modal">
				<v-card-title>
					<h2 class="modal__title">Set Statistic Options</h2>
				</v-card-title>
				<v-card-text class="modal__form">
					<section class="modal__form-section period">
						<span>Set statistic period</span>
						<v-radio-group v-model="radioPeriod">
							<v-radio label="Current week" value="Current Week"></v-radio>
							<v-radio label="Current month" value="Current Month"></v-radio>
							<v-radio label="Salary month" value="Salary Month"></v-radio>
						</v-radio-group>
					</section>
					<section class="modal__form-section card">
						<span>Set card</span>
						<v-select v-model="selectedCard" label="Card" :items="cardsList"></v-select>
					</section>
					<section class="modal__form-section money-type">
						<span>Set money type</span>
						<v-radio-group v-model="radioMoneyType" inline>
							<v-radio class="mr-4" label="All" value="All"></v-radio>
							<v-radio class="mr-4" label="Bank" value="bank"></v-radio>
							<v-radio label="Cash" value="cash"></v-radio>
						</v-radio-group>
					</section>
					<section class="modal__form-section operation-type">
						<span>Set operation type</span>
						<v-radio-group v-model="radioOperationType" inline>
							<v-radio class="mr-4" label="All" value="All"></v-radio>
							<v-radio class="mr-4" label="Plus" value="plus"></v-radio>
							<v-radio label="Minus" value="minus"></v-radio>
						</v-radio-group>
					</section>
					<section class="modal__form-section tags">
						<span>Set tags</span>
						<div class="tags__wrapper" :key="refreshKey">
							<v-btn
								v-if="tagsForCurrentOptions.length > 0"
								class="tags__btn-cansel"
								@click="onSelectedTagsClean"
								>All</v-btn
							>
							<TagItem
								v-for="tag in tagsList"
								:key="tag.Id"
								:tag="tag"
								:mode="'Operation'"
								@onAddTag="onAddTagForCurrentOptions"
								@onCancelTag="onDeleteTagFromCurrentOption"
							/>
						</div>
					</section>
					<div class="modal__form-divider"></div>
					<section class="modal__form-section btns">
						<v-btn class="btns__button" @click="onOk">Ok</v-btn>
						<v-btn class="btns__button" @click="onCloseModal">Cansel</v-btn>
					</section>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup lang="ts">
	import moment from 'moment-timezone';
	import { nanoid } from 'nanoid';
	import {
		type ICard,
		type IStatisticOptions,
		type ITag,
		type StatisticsPeriodType,
		type TCardMoney,
		type TOperationType,
	} from '@/models/types/cardTypes';
	import { useSettingsStore } from '@/stores/settingsStore';
	import { useStatisticsStore } from '@/stores/statisticsStore';
	import { useOperationsStore } from '@/stores/operationsStore';
	import { useWalletStore } from '@/stores/walletStore';
	import { useTagsStore } from '@/stores/tagsStore';

	import TagItem from '@/pages/components/card-one-change-balance/TagItem.vue';

	moment.updateLocale('en', {
		week: {
			dow: 1, // Устанавливаем понедельник как первый день недели
		},
	});

	const emit = defineEmits<{
		'update:modelValue': [type: boolean];
		applyOptions: [type: void];
	}>();

	const props = defineProps<{
		modelValue: boolean;
	}>();

	const isShow = computed({
		get() {
			return props.modelValue;
		},
		set(value) {
			emit('update:modelValue', value);
		},
	});

	const { settingsObject } = useSettingsStore();
	const {
		get_StatisticOptions,
		set_FromDate,
		set_ToDate,
		set_StatisticPeriod,
		set_Card,
		set_MoneyType,
		set_operationType,
		set_Tags,
	} = useStatisticsStore();
	const { get_OperationsByStatisticOptions } = useOperationsStore();
	const { getCard_ById } = useWalletStore();
	const { get_TagFromStatisticTagsList } = useTagsStore();

	const optionsObj = ref<IStatisticOptions | undefined>();

	const radioPeriod = ref<StatisticsPeriodType>('Current Week');
	const periodBegin = ref<Date>(moment.tz('Europe/Moscow').startOf('week').toDate());
	const periodEnd = ref<Date | undefined>();
	const selectedCard = ref<string>('All');
	const cardsList = ref<string[]>(['All']);
	const radioMoneyType = ref<TCardMoney | 'All'>('All');
	const radioOperationType = ref<TOperationType | 'All'>('All');
	const tagsList = ref<ITag[]>([]);
	const tagsForCurrentOptions = ref<ITag[]>([]);
	const refreshKey = ref<string>('1');

	// открытие модального окна
	watch(
		() => props.modelValue,
		(newValue) => {
			if (newValue) {
				optionsObj.value = get_StatisticOptions();
				radioPeriod.value = optionsObj.value.periodType;
				initPeriodDates(optionsObj.value.periodType);
				initPreOptionsByPeriod();
			}
		}
	);

	watch(
		() => radioPeriod.value,
		(newValue) => {
			initPeriodDates(newValue);
			initPreOptionsByPeriod();
		}
	);

	const initPeriodDates = (period: StatisticsPeriodType) => {
		set_StatisticPeriod(period);
		switch (period) {
			case 'Current Week':
				periodBegin.value = moment().startOf('week').toDate();
				break;
			case 'Current Month':
				periodBegin.value = moment().startOf('month').toDate();
				break;
			case 'Salary Month':
				const currentDay = moment().date();

				if (currentDay > settingsObject.salaryMonthStart) {
					// Если текущий день больше числа начала фин месяца, получаем дату этого месяца
					periodBegin.value = moment()
						.date(settingsObject.salaryMonthStart)
						.startOf('day')
						.toDate();
				} else {
					// Если текущий день меньше числа начала фин месяца, получаем дату прошлого месяца
					periodBegin.value = moment()
						.subtract(1, 'months')
						.date(settingsObject.salaryMonthStart)
						.startOf('day')
						.toDate();
				}
				break;
		}
	};

	const initPreOptionsByPeriod = () => {
		periodEnd.value = moment.tz('Europe/Moscow').startOf('minute').toDate();

		set_FromDate(periodBegin.value);
		set_ToDate(periodEnd.value);

		optionsObj.value = get_StatisticOptions();
		selectedCard.value = optionsObj.value.card ? optionsObj.value.card : 'All';
		radioMoneyType.value = optionsObj.value.moneyType ? optionsObj.value.moneyType : 'All';
		radioOperationType.value = optionsObj.value.operationType
			? optionsObj.value.operationType
			: 'All';
		tagsList.value = optionsObj.value.tags;

		const operationsList = get_OperationsByStatisticOptions(optionsObj.value);

		if (operationsList && operationsList.length > 0) {
			let cardNames: string[] = [];
			let tags: string[] = [];

			operationsList.forEach((item) => {
				const card = getCard_ById(item.cardId);
				if (card) {
					cardNames.push(card.cardName);
				}

				if (tagsList.value.length > 0) return;
				if (item.tags.length > 0) {
					tags = [...tags, ...item.tags];
				}
			});

			cardsList.value = [];
			cardsList.value = ['All', ...Array.from(new Set(cardNames))];

			if (tagsList.value.length > 0) return;
			const unicTags = Array.from(new Set(tags));
			tagsList.value = [];

			unicTags.forEach((tagId) => {
				const tag = get_TagFromStatisticTagsList(tagId);
				if (tag) {
					tagsList.value.push(tag);
				}
			});
		}
	};

	const onAddTagForCurrentOptions = (tag: ITag) => {
		tagsForCurrentOptions.value = [...tagsForCurrentOptions.value, tag];
	};

	const onDeleteTagFromCurrentOption = (tag: ITag) => {
		tagsForCurrentOptions.value = tagsForCurrentOptions.value.filter((item) => item.Id !== tag.Id);
	};

	const onSelectedTagsClean = () => {
		set_Tags([]);
		tagsForCurrentOptions.value = [];
		initPreOptionsByPeriod();
		refreshKey.value = nanoid();
	};

	const onCloseModal = () => {
		emit('update:modelValue', false);
	};

	const onOk = async () => {
		set_StatisticPeriod(radioPeriod.value);
		set_Card(selectedCard.value);
		set_MoneyType(radioMoneyType.value);
		set_operationType(radioOperationType.value);
		set_Tags(tagsForCurrentOptions.value);
		await nextTick();
		emit('applyOptions');
		onCloseModal();
	};
</script>

<style scoped lang="scss">
	@use './statistic-options.scss' as *;
</style>
