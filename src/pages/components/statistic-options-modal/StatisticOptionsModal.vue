<template>
	<div>
		<VDialog v-model="isShow" :persistent="true">
			<VCard class="modal">
				<VCardTitle>
					<h2 class="modal__title">Set Statistic Options</h2>
				</VCardTitle>
				<VCardText class="modal__form">
					<section class="modal__form-section period">
						<span>Set statistic period</span>
						<VRadioGroup v-model="radioPeriod" inline>
							<VRadio label="Today" value="Today"></VRadio>
							<VRadio label="Current week" value="Current Week"></VRadio>
							<VRadio label="Current month" value="Current Month"></VRadio>
							<VRadio label="Salary month" value="Salary Month"></VRadio>
						</VRadioGroup>
					</section>
					<section class="modal__form-section card">
						<span>Set card</span>
						<VSelect v-model="selectedCard" label="Card" :items="cardsList"></VSelect>
					</section>
					<section class="modal__form-section money-type">
						<span>Set money type</span>
						<VRadioGroup v-model="radioMoneyType" inline>
							<VRadio class="mr-4" label="All" value="All"></VRadio>
							<VRadio class="mr-4" label="Bank" value="bank"></VRadio>
							<VRadio label="Cash" value="cash"></VRadio>
						</VRadioGroup>
					</section>
					<section class="modal__form-section operation-type">
						<span>Set operation type</span>
						<VRadioGroup v-model="radioOperationType" inline>
							<VRadio class="mr-4" label="All" value="All"></VRadio>
							<VRadio class="mr-4" label="Plus" value="plus"></VRadio>
							<VRadio label="Minus" value="minus"></VRadio>
						</VRadioGroup>
					</section>
					<section class="modal__form-section tags">
						<span>Set tags</span>
						<div class="tags__wrapper" :key="refreshKey">
							<VBtn
								v-if="tagsForCurrentOptions.length > 0"
								class="tags__btn-cansel"
								@click="onSelectedTagsClean"
								>All</VBtn
							>
							<TagItem
								v-for="tag in tagsList"
								:key="tag.Id"
								:tag="tag"
								:mode="'Operation'"
								@onAddTag="onAddTagForCurrentOptions"
								@onCancelTag="onDeleteTagFromCurrentOption"
								@tagFromOptionStatistics="fnSelectedTagsToList"
							/>
						</div>
					</section>
					<div class="modal__form-divider"></div>
					<section class="modal__form-section btns">
						<VBtn class="btns__button" @click="onOk">Ok</VBtn>
						<VBtn class="btns__button" @click="onCloseModal">Cansel</VBtn>
					</section>
				</VCardText>
			</VCard>
		</VDialog>
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

	const { get_SettingsObject } = useSettingsStore();
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

	const radioPeriod = ref<StatisticsPeriodType>('Today');
	const periodBegin = ref<Date>(moment.tz('Europe/Moscow').startOf('week').toDate());
	const periodEnd = ref<Date | undefined>();
	const selectedCard = ref<string>('All');
	const cardsList = ref<string[]>(['All']);
	const radioMoneyType = ref<TCardMoney | 'All'>('All');
	const radioOperationType = ref<TOperationType | 'All'>('All');
	const tagsList = ref<ITag[]>([]);
	const tagsForCurrentOptions = ref<ITag[]>([]);

	const refreshKey = ref<string>('1');
	const isWatch_tagsForCurrentOptions = ref<boolean>(true);

	// открытие модального окна
	watch(
		() => props.modelValue,
		async (newValue) => {
			if (newValue) {
				optionsObj.value = get_StatisticOptions();
				radioPeriod.value = optionsObj.value.periodType;
				initPeriodDates(optionsObj.value.periodType);
				await nextTick();
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
			case 'Today':
				periodBegin.value = moment().startOf('day').toDate();
				break;
			case 'Current Week':
				periodBegin.value = moment().startOf('week').toDate();
				break;
			case 'Current Month':
				periodBegin.value = moment().startOf('month').toDate();
				break;
			case 'Salary Month':
				const currentDay = moment().date();

				if (currentDay > get_SettingsObject().salaryMonthStart) {
					// Если текущий день больше числа начала фин месяца, получаем дату этого месяца
					periodBegin.value = moment()
						.date(get_SettingsObject().salaryMonthStart)
						.startOf('day')
						.toDate();
				} else {
					// Если текущий день меньше числа начала фин месяца, получаем дату прошлого месяца
					periodBegin.value = moment()
						.subtract(1, 'months')
						.date(get_SettingsObject().salaryMonthStart)
						.startOf('day')
						.toDate();
				}
				break;
		}
		periodEnd.value = moment.tz('Europe/Moscow').startOf('minute').toDate();
	};

	const initPreOptionsByPeriod = () => {
		set_FromDate(periodBegin.value);
		set_ToDate(periodEnd.value!);
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

	const tagsListFromOptionStatistic = ref<(() => ITag)[]>([]);
	const fnSelectedTagsToList = (fn: () => ITag) => {
		tagsListFromOptionStatistic.value.push(fn);
	};

	watch(
		() => tagsListFromOptionStatistic.value.length,
		(newValue) => {
			if (newValue === 0) return;
			if (
				optionsObj.value &&
				optionsObj.value.tags.length > 0 &&
				newValue === tagsList.value.length
			) {
				tagsListFromOptionStatistic.value.forEach((item) => {
					const tag = item();
					tagsForCurrentOptions.value.push(tag);
				});
			}
		}
	);

	const onAddTagForCurrentOptions = (tag: ITag) => {
		tagsForCurrentOptions.value = [tag, ...tagsForCurrentOptions.value];
	};

	const onDeleteTagFromCurrentOption = (tag: ITag) => {
		tagsForCurrentOptions.value = tagsForCurrentOptions.value.filter((item) => item.Id !== tag.Id);
	};

	watch(
		() => tagsForCurrentOptions.value.length,
		async (newValue, oldValue) => {
			if (!isWatch_tagsForCurrentOptions.value) return;

			if (oldValue > 0 && newValue === 0) {
				set_Tags([]);
				await nextTick();
				emit('applyOptions');

				initPreOptionsByPeriod();
				refreshKey.value = nanoid();
			}
		}
	);

	const onSelectedTagsClean = async () => {
		isWatch_tagsForCurrentOptions.value = false;
		set_Tags([]);
		tagsForCurrentOptions.value = [];

		await nextTick();
		emit('applyOptions');

		initPreOptionsByPeriod();
		refreshKey.value = nanoid();
		isWatch_tagsForCurrentOptions.value = true;
	};

	const onCloseModal = () => {
		tagsList.value = [];
		tagsListFromOptionStatistic.value = [];
		emit('update:modelValue', false);
	};

	const onOk = async () => {
		isWatch_tagsForCurrentOptions.value = false;
		await nextTick();
		set_StatisticPeriod(radioPeriod.value);
		set_Card(selectedCard.value);
		set_MoneyType(radioMoneyType.value);
		set_operationType(radioOperationType.value);
		set_Tags(tagsForCurrentOptions.value);
		await nextTick();
		tagsForCurrentOptions.value = [];
		emit('applyOptions');
		onCloseModal();
		await nextTick();
		isWatch_tagsForCurrentOptions.value = true;
	};
</script>

<style scoped lang="scss">
	@use './statistic-options.scss' as *;
</style>
