import { createRouter, createWebHistory } from "vue-router";
import MemberProfile from "../views/MemberProfile.vue";
import HomeView from "../views/HomeView.vue";
import GoogleMapView from "@/views/GoogleMapView.vue";
import EmailSettings from "@/views/EmailSettings.vue";

const routes = [
  {
    path: "/profile",
    name: "profile",
    component: MemberProfile,
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
