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
        name: 'Mobile',
        component: () => import("@/views/Mobile.vue")
    },
    {
        path: '/image-server',
        name: 'ImageServer',
        component: () => import("@/views/ImageServer.vue")
    }
]

const routerOptions: RouterOptions = {
    history: createWebHashHistory(),
    routes
}

export const router = createRouter(routerOptions)
