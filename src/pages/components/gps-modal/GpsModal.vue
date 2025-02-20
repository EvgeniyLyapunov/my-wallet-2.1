<template>
	<div>
		<v-dialog v-model="isShow" :persistent="true">
			<v-card class="modal">
				<v-card-title>
					<h2 class="modal__title">Проверка работы с API GPS в браузере</h2>
				</v-card-title>
				<v-card-text>
					<section class="modal__coords coords">
						<label class="coords__lat">
							<span class="coords__lat-label">Latitude:</span>
							<input v-model="lat" class="coords__lat-input" type="text" readonly />
						</label>
						<label class="coords__lng">
							<span class="coords__lng-label">Longitude:</span>
							<input v-model="lng" class="coords__lng-input" type="text" readonly />
						</label>
					</section>
					<section style="width: 100%; height: 280px">
						<div
							id="map"
							class="map"
							style="width: 100%; height: 280px; overflow: hidden"
							:key="refreshKey"
						></div>
					</section>
					<section class="modal__msg msg">
						<span class="msg__value">{{ errorMessage }}</span>
					</section>
					<section class="modal__btns btns">
						<v-btn class="btns__button" @click="onClear">Очистить</v-btn>
						<v-btn
							class="btns__button_go"
							icon="mdi-map-marker-radius"
							@click="onGetCoords"
						></v-btn>
						<v-btn class="btns__button" @click="onCloseModal">Закрыть</v-btn>
					</section>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup lang="ts">
	import * as L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { nanoid } from 'nanoid';

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

	const lat = ref<number>(0);
	const lng = ref<number>(0);
	const errorMessage = ref<string | null>(null);
	const mapInstance = ref();
	const refreshKey = ref<string>('1');

	const onClear = () => {
		lat.value = 0;
		lng.value = 0;
		errorMessage.value = null;
		mapInstance.value = undefined;
		refreshKey.value = nanoid();
	};

	const onCloseModal = () => {
		onClear();
		emit('update:modelValue', false);
	};

	const onGetCoords = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					lat.value = position.coords.latitude;
					lng.value = position.coords.longitude;
				},
				(error) => {
					switch (error.code) {
						case error.PERMISSION_DENIED:
							errorMessage.value = 'Разрешение на геолокацию отклонено.';
							break;
						case error.POSITION_UNAVAILABLE:
							errorMessage.value = 'Информация о местоположении недоступна.';
							break;
						case error.TIMEOUT:
							errorMessage.value = 'Запрос на геолокацию превысил время ожидания.';
							break;
						default:
							errorMessage.value = 'Произошла неизвестная ошибка.';
							break;
					}
				}
			);
		} else {
			errorMessage.value = 'Ваш браузер не поддерживает геолокацию.';
		}
	};

	const initMap = () => {
		mapInstance.value = L.map('map').setView([lat.value, lng.value], 13);
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
		}).addTo(mapInstance.value!);

		const triangleIcon = L.divIcon({
			className: 'custom-marker',
			html: `
            <svg width="30" height="30" viewBox="0 0 30 30">
                <polygon points="15,30 0,0 30,0" style="fill:orange;"/>
            </svg>
        `,
			iconSize: [30, 30],
			iconAnchor: [15, 30],
		});

		L.marker([lat.value, lng.value], { icon: triangleIcon }).addTo(mapInstance.value);

		// скрываем копирайт
		const copyEl: HTMLElement | null = document.querySelector('.leaflet-bottom.leaflet-right');
		if (copyEl !== null) {
			copyEl.style.display = 'none';
		}
		mapInstance.value.invalidateSize();
	};

	watch(
		() => lat.value,
		(newValue) => {
			if (newValue > 0) {
				setTimeout(() => {
					initMap();
				}, 100);
			}
		}
	);
</script>

<style scoped lang="scss">
	@import './gps-modal.scss';
</style>
;
