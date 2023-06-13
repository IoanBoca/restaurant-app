import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import ReservationsView from "@/views/ReservationsView.vue";
import AuthView from "@/views/AuthView.vue";
import FoodMenuView from "@/views/FoodMenuView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView
  },
  {
    path: "/about",
    name: "about",
    component: AboutView
  },
  {
    path: "/reservations",
    name: "reservations",
    component: ReservationsView
  },
  {
    path: "/auth",
    name: "auth",
    component: AuthView
  },
  {
    path: "/food-menu",
    name: "food-menu",
    component: FoodMenuView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500"
});

export default router;
