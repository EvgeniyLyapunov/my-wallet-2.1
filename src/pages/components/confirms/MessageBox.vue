<template>
	<div>
		<v-dialog v-model="isShow" :persistent="true">
			<v-card class="message-box">
				<v-card-title>{{ getTitle() }}</v-card-title>
				<v-card-text>
					<div class="message-box__img-wrap">
						<img class="message-box__img" src="@/assets/images/img/info.png" alt="info sign" />
					</div>
					<div class="message-box__text-wrap">
						<span class="message-box__text">
							{{ getMessage() }}
						</span>
					</div>
				</v-card-text>
				<v-card-actions>
					<v-btn prepend-icon="mdi-check" variant="elevated" width="120" @click="onOk">
						<template v-slot:prepend>
							<v-icon color="green"></v-icon>
						</template>
						Ok
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup lang="ts">
	const emit = defineEmits<{
		'update:modelValue': [type: boolean];
	}>();

	const props = defineProps<{
		modelValue: boolean;
		title: string;
		message: string;
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
		return props.title;
	};

	const getMessage = (): string => {
		return props.message;
	};

	const onOk = () => {
		emit('update:modelValue', false);
	};
</script>

<style scoped lang="scss">
	@import './message-box.scss';
</style>
