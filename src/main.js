import './assets/main.css';

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
} from '@fortawesome/free-solid-svg-icons';


library.add(
    faXmark,
    faPenToSquare,
    faAngleLeft,
    faAngleRight,
    faPlus,
    faArrowLeft,
    faCamera,
);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

import { useTripStore } from '@/stores/tripStore';
const tripStore = useTripStore();
tripStore.load();

app.use(router);

app.component('FontAwesomeIcon', FontAwesomeIcon);

app.mount('#app');