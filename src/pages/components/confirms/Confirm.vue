<template>
	<div>
		<v-dialog v-model="isShow" :persistent="true">
			<v-card class="confirm">
				<v-card-title>{{ getTitle() }}</v-card-title>
				<v-card-text>
					<div class="confirm__img-wrap">
						<img class="confirm__img" src="@/assets/images/img/card_delete.png" alt="delete card" />
					</div>
					<div class="confirm__text-wrap">
						<span class="confirm__text">
							{{ getText() }}
						</span>
					</div>
				</v-card-text>
				<v-card-actions>
					<v-btn prepend-icon="mdi-check" variant="elevated" width="120" @click="onConfirm">
						<template v-slot:prepend>
							<v-icon color="green"></v-icon>
						</template>
						Ok
					</v-btn>
					<v-btn prepend-icon="mdi-cancel" variant="elevated" width="120" @click="closeModal">
						<template v-slot:prepend>
							<v-icon color="yellow"></v-icon>
						</template>
						Отмена
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup lang="ts">
	const emit = defineEmits<{
		'update:modelValue': [type: boolean];
		confirm: [type: boolean];
	}>();

	const props = defineProps<{
		modelValue: boolean;
		confirmAction: string;
		confirmInfo?: string;
	}>();

	const isShow = computed({
		get() {
			return props.modelValue;
		},
		set(value) {
			emit('update:modelValue', value);
		},
	});

	const getTitle = (): string => {
		return props.confirmAction;
	};

	const getText = (): string => {
		if (props.confirmInfo) {
			return props.confirmInfo;
		} else {
			return 'Вы уверены? Эта операция необратима!';
		}
	};

	const onConfirm = () => {
		emit('confirm', true);
		closeModal();
	};

	const closeModal = () => {
		isShow.value = false;
	};
</script>

<style scoped lang="scss">
	@import './confirm.scss';
</style>
