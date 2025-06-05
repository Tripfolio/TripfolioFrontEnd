import { createRouter, createWebHistory } from "vue-router";
// import HomeView from "../views/HomeView.vue";
// import MemberProfile from "../views/MemberProfile.vue";
// import GoogleMapView from "@/views/GoogleMapView.vue";
// import EmailSettings from "@/views/EmailSettings.vue";
import Travel from "@/views/Travel.vue";

const routes = [
  // {
  //   path: "/",
  //   name: "home",
  //   component: HomeView,
  // },
  // {
  //   path: "/profile",
  //   name: "profile",
  //   component: MemberProfile,
  // },
  // {
  //   path: "/emailSettings",
  //   name: "emailSettings",
  //   component: EmailSettings,
  // },
  // {
  //   path: "/map",
  //   name: "map",
  //   component: GoogleMapView,
  // },
  {
    path: "/schedule",
    name: "schedule",
    component: Travel,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
