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
    <div class="home-view">
        waiting...
    </div>
</template>

<style lang="scss" scoped>
.home-view {
    position: relative;
    width: 100%;
    height: 100%;
    color: #7b7b7b;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
