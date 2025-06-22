import './assets/main.css';
import axios from "axios";
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
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
  faPaste
} from '@fortawesome/free-solid-svg-icons';
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
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
  faPaste
);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.mount('#app');