import { createRouter, createWebHistory } from 'vue-router'
import SignUp from '@/views/SignUp.vue'
import HomeView from '@/views/HomeView.vue'
import GoogleMapView from '@/views/GoogleMapView.vue'
import MemberProfile from '@/views/MemberProfile.vue'
import GoogleCalendar from "@/views/GoogleCalendar.vue"
import EmailSettings from '@/views/EmailSettings.vue'
import ProfilePreview from '@/views/ProfilePreview.vue'

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
  {
    path: "/profilePreview",
    name: "profilePreview",
    component: ProfilePreview,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
