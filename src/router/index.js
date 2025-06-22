import { createRouter, createWebHistory } from "vue-router";
import SignUp from "@/views/SignUp.vue";
import LoginPage from "@/views/LoginPage.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp,
  },
  {
    path: "/map",
    name: "map",
    component: () => import("@/views/GoogleMapView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/calendar",
    name: "calendar",
    component: () => import("@/views/GoogleCalendar.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/MemberProfile.vue"),
  },
  {
    path: "/emailSettings",
    name: "emailSettings",
    component: () => import("@/views/EmailSettings.vue"),
  },
  {
    path: "/schedule",
    name: "schedule",
    component: () => import("@/views/Travel.vue"),
  },
  {
    path: "/community/post",
    name: "communityPost",
    component: () => import("@/components/PostForm.vue"),
  },
  {
    path: "/community",
    name: "community",
    component: () => import("@/views/CommunityList.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;