<script lang="ts" setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";

const route = useRoute()
const boxRef = ref()
const tryParse = () => {
    const box = boxRef.value
    if(!!box) {
        box.innerHTML = `<img src="${ route.query?.code?.trim() ?? '' }" alt="图片解析出错"/>`
    }
}

onMounted(() => {
    tryParse()
})
</script>

<template>
    <div class="image-server with-scroll" ref="boxRef"></div>
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
