<template>
	<div>
		<v-dialog v-model="isShow" :persistent="true">
			<v-card class="modal">
				<v-card-title>
					<h2 class="modal__title">Проверка работы с API File в браузере</h2>
				</v-card-title>
				<v-card-text>
					<input
						type="file"
						accept="image/*"
						capture="environment"
						ref="fileInput"
						@change="onFileChange"
						style="display: none"
					/>
					<section class="preview">
						<img v-if="photo" class="preview__img" :src="photo" />
					</section>
					<section class="modal__btns btns">
						<v-btn class="btns__button" @click="onClear">Очистить</v-btn>
						<v-btn class="btns__button_go" icon="mdi-camera" @click="onOpenCamera"></v-btn>
						<v-btn class="btns__button" @click="onCloseModal">Закрыть</v-btn>
					</section>
				</v-card-text>
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
	}>();

	const isShow = computed({
		get() {
			return props.modelValue;
		},
		set(value) {
			emit('update:modelValue', value);
		},
	});

	const photo = ref<string | null>(null);
	const fileInput = ref<HTMLInputElement | null>(null);

	const onFileChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (files && files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener('load', (e) => {
				photo.value = e.target?.result as string; // Сохраняем фото в переменную
			});
			reader.readAsDataURL(files[0]);
		}
	};

	const onCloseModal = () => {
		onClear();
		isShow.value = false;
	};

	const onOpenCamera = () => {
		fileInput.value?.click();
	};

	const onClear = () => {
		photo.value = null;
	};
</script>

<style scoped lang="scss">
	@import './photo-modal.scss';
</style>
