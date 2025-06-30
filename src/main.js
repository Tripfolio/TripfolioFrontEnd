import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// 語言
import { createI18n } from "vue-i18n";
import messages from "./locales/index.js";
import en from './locales/en.js';
import zhTW from './locales/zh-TW.js';
import ja from './locales/ja.js';
import ko from './locales/ko.js';

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
  faUser,
);

const i18n = createI18n({
  locale: "zh-TW",
  messages,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.component("FontAwesomeIcon", FontAwesomeIcon);
app.mount("#app");

export default {
  en,
  'zh-TW': zhTW,
  ja,
  ko,
};
