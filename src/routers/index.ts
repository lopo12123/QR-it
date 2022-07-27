import { createRouter, createWebHashHistory, RouteRecordRaw, RouterOptions } from "vue-router";
import Home from "@/views/Home.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/desktop',
        name: 'Desktop',
        component: () => import("@/views/Desktop.vue")
    },
    {
        path: '/mobile',
        name: 'mobile',
        component: () => import("@/views/Mobile.vue")
    },
]

const routerOptions: RouterOptions = {
    history: createWebHashHistory(),
    routes
}

export const router = createRouter(routerOptions)