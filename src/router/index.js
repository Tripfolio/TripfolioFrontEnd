import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import SignUp from "@/views/SignUp.vue";
import LoginPage from "@/views/LoginPage.vue";
import GoogleMapView from "@/views/GoogleMapView.vue";
import GoogleCalendar from "@/views/GoogleCalendar.vue";
import EmailSettings from "@/views/EmailSettings.vue";
import Travel from "@/views/Travel.vue";
import GetInvite from "@/views/GetInvite.vue";
import Post from "@/components/PostForm.vue";
import Community from "@/views/CommunityList.vue";
import scheduleDetail from "@/views/scheduleDetail.vue";
import MemberProfile from "@/views/MemberProfile.vue";
import MemberHub from "@/views/MemberHub.vue";
import PrivacyPolicy from '../views/PrivacyPolicy.vue' 
import TermsOfService from '../views/TermsOfService.vue' 

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
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
    component: MemberHub,
  },
  {
    path: "/emailSettings",
    name: "emailSettings",
    component: () => import("@/views/EmailSettings.vue"),
  },
  {
    path: "/share/:token",
    name: "GetInvite",
    component: GetInvite,
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
  {
    path: "/schedule/:id",
    name: "scheduledetail",
    component: scheduleDetail,
  },
  {
    path: '/privacy-policy', 
    name: 'privacy-policy',
    component: PrivacyPolicy, 
  },
  {
    path: '/terms-of-service', 
    name: 'terms-of-service',
    component: TermsOfService,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.name === 'privacy-policy' || to.name === 'terms-of-service') {
      // 如果目標路由是隱私權政策或服務條款頁面，則平滑滾動到頂部
      return { top: 0, behavior: 'smooth' }
    } else {
      // 對於其他所有新的路由導航，即時滾動到頂部
      return { top: 0 }
    }
  }
});

export default router;
