import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import SignUp from "@/views/SignUp.vue";
import LoginPage from "@/views/LoginPage.vue";
import GoogleMapView from "@/views/GoogleMapView.vue";
import MemberProfile from "@/views/MemberProfile.vue";
// import ProfilePreview from "@/views/ProfilePreview.vue";
import GoogleCalendar from "@/views/GoogleCalendar.vue";
import TripPlannerView from "@/views/TripPlannerView.vue";
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
    path: "/editProfile",
    name: "editProfile",
    component: MemberProfile,
  },
  // {
  //   path: "/profile", // 如果profile復原這頁請修改路徑
  //   name: "profilePreview",
  //   component: ProfilePreview, // 會員中心
  // },
  {
    path: "/emailSettings",
    name: "emailSettings",
    component: EmailSettings,
  },
  {
    path: "/trips",
    name: "trips",
    component: TripPlannerView,
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
    path: "/social",
    name: "social",
    component: SocialHomePage,
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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
