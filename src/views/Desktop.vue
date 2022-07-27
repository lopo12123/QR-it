<script lang="ts" setup>
import { ref } from "vue";
import { OutputType } from "@/scripts";

const target = ref<OutputType>('text')

const toQR = () => {
    console.log(target.value)
}
</script>

<template>
    <div class="desktop-view">
        <div class="output-selector">
            <div :class="target === 'text' ? 'active' : 'default'"
                 @click="target === 'text'">
                Text
            </div>
            <div :class="target === 'url' ? 'active' : 'default'"
                 @click="target === 'url'">
                URL
            </div>
            <div :class="target === 'image' ? 'active' : 'default'"
                 @click="target === 'image'">
                Image
            </div>
        </div>

        <!--region source-box-->
        <div class="text-source">

        </div>
        <div class="url-source">

        </div>
        <div class="image-source">

        </div>
        <!-- endregion -->

        <div class="fake-btn" @click="toQR">Generate QR Code</div>
    </div>
</template>

<style lang="scss" scoped>
.desktop-view {
    position: relative;
    width: calc(100% - 4rem);
    height: calc(100% - 4rem);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    .output-selector {
        position: relative;
        width: 100%;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .item {
            position: relative;
            height: 2rem;
            padding: 0 1.5rem;
            margin-right: 1rem;
            border: solid 1px #7b7b7b;
            border-radius: 1.5rem 0 1.5rem 0;
            line-height: 2rem;
            user-select: none;
            cursor: pointer;
            box-sizing: border-box;
        }

        .default {
            @extend .item;
            color: #7b7b7b;
            background-color: #f4f4f4;
        }

        .active {
            @extend .item;
            color: #f4f4f4;
            background-color: #7b7b7b;
        }
    }

    // region source-box
    .text-source {

    }

    .url-source {

    }

    .image-source {

    }

    // endregion

    .fake-btn {
        position: relative;
        width: 12rem;
        height: 2rem;
        margin: 1rem 0;
        border-radius: 1rem;
        color: #f4f4f4;
        background-color: #7b7b7b;
        text-align: center;
        line-height: 2rem;
        user-select: none;
        cursor: pointer;
    }
}
</style>
