import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import GoogleMapView from "@/views/GoogleMapView.vue";
import GoogleCalendar from "@/views/GoogleCalendar.vue";
import EmailSettings from "@/views/EmailSettings.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/map",
    name: "map",
    component: GoogleMapView,
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: GoogleCalendar,
  },
  {
    path: "/emailSettings",
    name: "emailSettings",
    component: EmailSettings,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
