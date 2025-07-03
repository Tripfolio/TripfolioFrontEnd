import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { initializeAuth } from "./composable/authUtils";

import { createI18n } from "vue-i18n";
import messages from "./locales/index.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faXmark,
  faPenToSquare,
  faAngleLeft,
  faAngleRight,
  faPlus,
  faArrowLeft,
  faCamera,
  faEye,
  faEyeSlash,
  faExclamationTriangle,
  faEllipsisH,
  faPaste,
  faCompass,
  faGlobe,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faXmark,
  faPenToSquare,
  faAngleLeft,
  faAngleRight,
  faPlus,
  faArrowLeft,
  faCamera,
  faEye,
  faEyeSlash,
  faExclamationTriangle,
  faEllipsisH,
  faPaste,
  faCompass,
  faGlobe,
  faUser
);

const app = createApp(App);

const i18n = createI18n({
  legacy: false,  // 關閉 legacy 模式
  locale: "zh-TW",  // 預設語言
  messages,         // 語言包
});


app.use(i18n);

app.use(createPinia());
initializeAuth(router);
app.use(router);
app.component("FontAwesomeIcon", FontAwesomeIcon);
app.mount("#app");
