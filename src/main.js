import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import vClickOutside from "v-click-outside";

import {
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

library.add(faExclamationTriangle, faEye, faEyeSlash, faEllipsisH);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vClickOutside);

app.component("FontAwesomeIcon", FontAwesomeIcon);

app.mount("#app");
