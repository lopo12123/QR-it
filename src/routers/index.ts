import { createRouter, createWebHashHistory, RouteRecordRaw, RouterOptions } from "vue-router";
import Home from "@/views/Home.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }
]

const routerOptions: RouterOptions = {
    history: createWebHashHistory(),
    routes
}

export const router = createRouter(routerOptions)