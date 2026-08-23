import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "vuetify/styles";

import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";

import "@/style/base.scss";

import App from "./App.vue";
import router from "./router";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Moscow");
dayjs.extend(updateLocale);
dayjs.extend(isSameOrAfter);

dayjs.updateLocale("en", {
  weekStart: 1, // Устанавливаем понедельник как первый день недели
});

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
  },
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount("#app");
