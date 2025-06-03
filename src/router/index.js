import { createRouter, createWebHistory } from "vue-router";
import TravelSchedule from "../views/TravelSchedule.vue";

const routes = [
  {
    path: "/travelSchedule",
    name: "travelSchedule",
    component: TravelSchedule,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
