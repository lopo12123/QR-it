<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter()

if(/android|iphone/i.test(navigator.userAgent)) {
    router.push({ name: 'Mobile' })
}
else {
    router.push({ name: 'Desktop' })
}
</script>

<template>
    <router-view/>
</template>