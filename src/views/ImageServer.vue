<script lang="ts" setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";

const route = useRoute()
const base64Code = ref('')
const tryParse = () => {
    try {
        base64Code.value = (route.query.code as string)
            ?.replace(/-/g, '/')
            ?.replace(/_/g, '+') ?? ''
    }
    catch (e) {
        console.log(e)
    }
}

onMounted(() => {
    tryParse()
})
</script>

<template>
    <div class="image-server with-scroll">
        <img class="pic" :src="base64Code" alt="图片解析错误">
    </div>
</template>

<style lang="scss" scoped>
.image-server {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
