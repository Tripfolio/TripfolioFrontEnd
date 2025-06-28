import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import SignUp from "@/views/SignUp.vue";
import LoginPage from "@/views/LoginPage.vue";
import GoogleMapView from "@/views/GoogleMapView.vue";
import MemberProfile from "@/views/MemberProfile.vue";
import GoogleCalendar from "@/views/GoogleCalendar.vue";
import EmailSettings from "@/views/EmailSettings.vue";
import Travel from "@/views/Travel.vue";
import UserActivity from "@/views/UserActivity.vue";
import GetInvite from "@/views/GetInvite.vue";
import Post from "@/components/PostForm.vue";
import Community from "@/views/CommunityList.vue";
import scheduleDetail from "@/views/scheduleDetail.vue";
import Payment from "@/views/Payment.vue";
import LinePaySuccess from '@/views/LinePaySuccess.vue';
import LinePayFail from '@/views/LinePayFail.vue';

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
    component: GoogleMapView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/calendar",
    name: "calendar",
    component: GoogleCalendar,
  },
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
  {
    path: "/GetInvite",
    name: "GetInvite",
    component: GetInvite,
  },
  {
    path: "/schedule",
    name: "schedule",
    component: Travel,
  },
  {
    path: "/activity",
    name: "activity",
    component: UserActivity,
  },
  {
    path: "/community/post",
    name: "communityPost",
    component: Post,
  },
  {
    path: "/community",
    name: "community",
    component: Community,
  },
  {
    path: "/schedule/:id",
    name: "scheduledetail",
    component: scheduleDetail,
  },
  {
    path: "/payment",
    name: "payment",
    component: Payment,
  },
  {
    path: '/linepay-success',
    name: 'linepaysuccess',
    component: LinePaySuccess,
  },
  {
    path: '/linepay-fail',
    name: 'linepayfail',
    component: LinePayFail,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;