import { createRouter, createWebHistory } from "vue-router";
import HomeView from '@/views/HomeView.vue'
import SignUp from '@/views/SignUp.vue'
import LoginPage from '@/views/LoginPage.vue'
import GoogleMapView from "@/views/GoogleMapView.vue";
import MemberProfile from '@/views/MemberProfile.vue'
import EmailSettings from '@/views/EmailSettings.vue'
import GoogleCalendar from "@/views/GoogleCalendar.vue";



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
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/calendar',
    name: 'calendar',
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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
