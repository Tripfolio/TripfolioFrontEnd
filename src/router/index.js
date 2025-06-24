import { createRouter, createWebHistory } from "vue-router";
import SignUp from "@/views/SignUp.vue";
import LoginPage from "@/views/LoginPage.vue";
import GoogleMapView from "@/views/GoogleMapView.vue";
import MemberProfile from "@/views/MemberProfile.vue";
import GoogleCalendar from "@/views/GoogleCalendar.vue";
import EmailSettings from "@/views/EmailSettings.vue";
import Travel from "@/views/Travel.vue";
import SocialHomePage from "@/views/SocialHomePage.vue";
import GetInvite from "@/views/GetInvite.vue";
import Post from "@/components/PostForm.vue";
import Community from "@/views/CommunityList.vue";
import scheduleDetail from "@/views/scheduleDetail.vue";
import Payment from "@/views/Payment.vue";


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
    path: "/GetInvite",
    name: "GetInvite",
    component: GetInvite,
  },
  {
    path: "/schedule",
    name: "schedule",
    component: () => import("@/views/Travel.vue"),
  },
  {
    path: "/social",
    name: "social",
    component: SocialHomePage,
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
  {
    path: "/schedule/:id",
    name: "scheduledetail",
    component: scheduleDetail,
  },
  {
    path: "/social",
    name: "social",
    component: SocialHomePage,
  },
  {
    path: "/payment",
    name: "payment",
    component: Payment,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;