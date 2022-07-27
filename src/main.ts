import { createApp } from "vue";

import { router } from "@/routers";

import Index from "./Index.vue";

createApp(Index)
    .use(router)
    .mount('#app')