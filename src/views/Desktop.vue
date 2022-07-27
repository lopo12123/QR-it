<script lang="ts" setup>
import { ref } from "vue";
import { OutputType } from "@/scripts";
import { toCanvas } from "qrcode";

const targetType = ref<OutputType>('text')

// region 文本
const textSource = ref('')
// endregion

// region url
const protocol = ref<'https' | 'http'>('https')
const address = ref('')
// endregion

// region image
const selectImage = () => {
    alert('not support yet.')
    return;

    // todo! arraybuffer -> u8ClampedArray
    const ipt: HTMLInputElement = document.createElement('input')
    ipt.type = 'file'
    ipt.accept = '.png,.jpg'

    ipt.onchange = () => {
        const file = ipt.files?.[0]
        if(!file) drawFail('No File!')
        else {
            const reader = new FileReader()
            reader.onload = () => {
                const buffer = reader.result as ArrayBuffer
                const u8 = new Uint8Array(buffer)
                const u8clamped = new Uint8ClampedArray(buffer)

                console.log(buffer, u8clamped)

                // toCanvas(outputContainer.value!, [ {
                //     data: u8 as Buffer,
                //     mode: 'byte'
                // } ])
            }
            reader.readAsArrayBuffer(file)
        }
    }
    ipt.click()
}
// endregion

// region 渲染二维码
const outputContainer = ref<HTMLCanvasElement>()
const drawFail = (text?: string) => {
    const cvs = outputContainer.value
    if(!cvs) return

    cvs.style.width = '300px'
    cvs.style.height = '150px'
    cvs.width = 300
    cvs.height = 150
    const ctx = cvs.getContext('2d')!
    ctx.fillStyle = '#777'
    ctx.font = '16px bold'
    ctx.fillText(text ?? "Failed to generate QRCode. 😅", 0, 16)
}
const toQR = () => {
    const cvs = outputContainer.value
    if(!cvs) return

    switch (targetType.value) {
        case 'text':
            if(textSource.value.trim() === '') drawFail('Empty Input!')
            else toCanvas(cvs, textSource.value ?? '')
                .catch(_ => {
                    console.log(_)
                    drawFail()
                })
            break
        case 'url':
            if(address.value.trim() === '') drawFail('Empty Input!')
            else toCanvas(cvs, `${ protocol.value }://${ address.value }`)
                .catch(_ => {
                    console.log(_)
                    drawFail()
                })
            break
        case 'image':
            break
    }
}
// endregion
</script>

<template>
    <div class="desktop-view">
        <div class="output-selector">
            <div :class="targetType === 'text' ? 'active' : 'default'"
                 @click="targetType = 'text'">
                Text
            </div>
            <div :class="targetType === 'url' ? 'active' : 'default'"
                 @click="targetType = 'url'">
                URL
            </div>
            <div :class="targetType === 'image' ? 'active' : 'default'"
                 @click="targetType = 'image'">
                Image
            </div>
        </div>

        <!--region source-box-->
        <textarea class="text-source"
                  v-if="targetType === 'text'"
                  v-model="textSource"/>

        <div class="url-source" v-if="targetType === 'url'">
            <div class="protocol-box">
                <div :class="protocol === 'https' ? 'active' : 'default'"
                     @click="protocol = 'https'">
                    https&#58//
                </div>
                <div :class="protocol === 'http' ? 'active' : 'default'"
                     @click="protocol = 'http'">
                    http&#58//
                </div>
            </div>

            <input class="address-box" type="text" v-model="address">
        </div>

        <div class="image-source" v-if="targetType === 'image'">
            <div class="fake-btn" @click="selectImage">👆 Pick an image</div>
            <div class="prefix"><b>Accept:</b> <i>picture within 2kb (*.png; *.jpg)</i></div>
        </div>
        <!-- endregion -->

        <div class="fake-btn" v-if="targetType !== 'image'" @click="toQR">Generate QR Code</div>

        <canvas ref="outputContainer"/>
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
        margin: 1rem 0;
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
        position: relative;
        width: 100%;
        height: 10rem;
        margin: 1rem 0;
        padding: 1rem;
        border: solid 1px #7b7b7b;
        border-radius: 0.5rem;
        outline: none;
        background-color: #f4f4f4;
        color: #7b7b7b;
        box-sizing: border-box;
        resize: none;
    }

    .url-source {
        position: relative;
        width: 100%;
        height: 2.5rem;
        margin: 1rem 0;
        padding: 0 0.5rem;
        border: solid 1px #7b7b7b;
        border-radius: 0.5rem;
        outline: none;
        background-color: #f4f4f4;
        color: #7b7b7b;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .protocol-box {
            position: relative;
            width: 10rem;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            > div {
                position: relative;
                width: calc(5rem - 2px);
                height: 100%;
                border: solid 1px #7b7b7b;
                font-style: italic;
                user-select: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .default {
                color: #7b7b7b;
                background-color: #ececec;
            }

            .active {
                color: #f4f4f4;
                background-color: #7b7b7b;
            }
        }

        .address-box {
            position: relative;
            width: calc(100% - 11rem);
            height: 1.5rem;
            border: none;
            border-bottom: solid 1px #9c9c9c;
            outline: none;
            background-color: transparent;
            color: #343434;
            font-family: sans-serif;
        }
    }

    .image-source {
        position: relative;
        width: 100%;

        .prefix {
            color: #7b7b7b;
            font-size: 0.75rem;
        }
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
