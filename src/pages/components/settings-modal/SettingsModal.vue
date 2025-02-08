<template>
	<div>
		<VDialog v-model="isShow" :persistent="true">
			<VCard class="modal">
				<VCardTitle>
					<h2 class="modal__title">Set Settings</h2>
				</VCardTitle>
				<VCardText class="modal__form form">
					<label class="form__salary">
						<span class="form__salary-label">Salary month start:</span>
						<input class="form__salary-value" type="number" v-model="inputSalary" />
						<span v-if="isSalaryInputError" class="form__salary-error">
							Enter a value from 1 to 28
						</span>
					</label>
					<label class="form__limit">
						<span class="form__limit-label">Daily limit:</span>
						<input class="form__limit-value" type="number" v-model="inputLimit" />
					</label>
					<div class="form__period">
						<v-select
							v-model="inputPeriod"
							clearable
							placeholder="Daily Limit Period"
							:items="['Current Week', 'Current Month', 'Salary Month']"
							variant="solo"
							density="compact"
						></v-select>
					</div>
					<section class="modal__btns btns">
						<v-btn class="button btns__save" @click="onSaveSettings">Save</v-btn>
						<v-btn class="button btns__close" @click="onCloseModal">Close</v-btn>
					</section>
				</VCardText>
			</VCard>
		</VDialog>
	</div>
</template>

<script setup lang="ts">
	import { useSettingsStore } from '@/stores/settingsStore';
	import type { DailyLimitPeriodType } from '@/models/types/cardTypes';
	import moment from 'moment';

	const { get_SettingsObject, set_DailyLimit, set_DailyLimitPeriod, set_SalaryMonthStart } =
		useSettingsStore();

	moment.updateLocale('en', {
		week: {
			dow: 1, // Устанавливаем понедельник как первый день недели
		},
	});

	const emit = defineEmits<{
		'update:modelValue': [type: boolean];
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

	const currentSettings = get_SettingsObject();

	const inputSalary = ref<number>(currentSettings.salaryMonthStart);
	const inputLimit = ref<number>(currentSettings.dailyLimit);
	const inputPeriod = ref<DailyLimitPeriodType>(currentSettings.dailyLimitPeriod);

	const isSalaryInputError = ref<boolean>(false);

	const onCloseModal = () => {
		inputSalary.value = currentSettings.salaryMonthStart;
		inputLimit.value = currentSettings.dailyLimit;
		inputPeriod.value = currentSettings.dailyLimitPeriod;
		emit('update:modelValue', false);
	};

	const validateInput = (): boolean => {
		let isValid = false;

		if (Number(inputSalary.value) < 1 || Number(inputSalary.value) > 28) {
			isSalaryInputError.value = true;
		} else {
			isSalaryInputError.value = false;
			isValid = true;
		}

		return isValid;
	};

	const onSaveSettings = () => {
		if (!validateInput()) return;

		set_SalaryMonthStart(Number(inputSalary.value));
		set_DailyLimit(Number(inputLimit.value));
		set_DailyLimitPeriod(inputPeriod.value);

		onCloseModal();
	};
</script>

<style scoped lang="scss">
	@import './settings-modal.scss';
</style>
