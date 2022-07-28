<script lang="ts" setup>
import { ref } from "vue";
import { QRCodeRenderersOptions, toCanvas } from "qrcode";

const targetType = ref<'text' | 'url' | 'image'>('text')

// 源内容大小限制
const textLimit = ref({
    L: 900,
    M: 700,
    Q: 550,
    H: 400
})
// 容错率
const errResist = ref({
    L: 0.07,
    M: 0.15,
    Q: 0.25,
    H: 0.30
})

// region source
// 文本
const textSource = ref('')
// url
const protocol = ref<'https' | 'http'>('https')
const address = ref('')
// 图片
const imgSourceName = ref('')
const imgSourceBase64 = ref('')
const selectImageSource = () => {
    const ipt = document.createElement('input')
    ipt.type = 'file'
    ipt.accept = '.png, .jpg'
    ipt.onchange = () => {
        const file = ipt.files?.[0]

        if(!file) return
        else if(file.size > 1500) drawFail('The picture seems too big!')
        else {
            drawFail('')
            const reader = new FileReader()
            reader.onload = () => {
                imgSourceName.value = file.name
                imgSourceBase64.value = reader.result as string
            }
            reader.readAsDataURL(file)
        }
    }
    ipt.click()
}
// endregion

// region custom options
const configurationVisible = ref(false)
const darkColor = ref('#000000')
const lightColor = ref('#ffffff')
const strokeWidth = ref(4)
const corrLevel = ref<'L' | 'M' | 'Q' | 'H'>('M')
const setCorrLevel = (to: 'L' | 'M' | 'Q' | 'H') => {
    corrLevel.value = to
    textSource.value = textSource.value.slice(0, textLimit.value[to])
}
const centerImage = ref('')
const centerImageName = ref('')
const pickCenterImage = () => {
    const ipt = document.createElement('input')
    ipt.type = 'file'
    ipt.accept = '.png, .jpg'
    ipt.onchange = () => {
        const file = ipt.files?.[0]

        if(!file) return
        else if(file.size > 1024 * 1024) drawFail('Too big, need less than 1MB!')
        else {
            const reader = new FileReader()
            reader.onload = () => {
                centerImageName.value = file.name
                centerImage.value = reader.result as string
            }
            reader.readAsDataURL(file)
        }
    }
    ipt.click()
}
const clearCenterImage = () => {
    centerImage.value = ''
    centerImageName.value = ''
}
// endregion

// region render
const outputContainer = ref<HTMLCanvasElement>()
// 在画布上渲染错误信息
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
// 在画布上渲染二维码和中心小图(如果存在)
const drawQR = (text: string) => {
    const cvs = outputContainer.value
    if(!cvs) return

    const options: QRCodeRenderersOptions = {
        errorCorrectionLevel: corrLevel.value,
        color: {
            dark: darkColor.value,
            light: lightColor.value
        },
        margin: strokeWidth.value
    }

    toCanvas(cvs, text, options)
        .then(() => {
            if(centerImageName.value !== '') {
                const ctx = cvs.getContext('2d')!
                const qrSize = cvs.width
                const blockSize = Math.floor(qrSize * errResist.value[corrLevel.value])
                const imgSize = Math.floor(blockSize * 0.8)
                const img = new Image(imgSize, imgSize)
                img.src = centerImage.value
                img.onload = () => {
                    ctx.fillStyle = lightColor.value
                    ctx.fillRect((qrSize - blockSize) / 2, (qrSize - blockSize) / 2, blockSize, blockSize)
                    ctx.drawImage(img, (qrSize - imgSize) / 2, (qrSize - imgSize) / 2, imgSize, imgSize)
                }
            }
        })
        .catch(_ => {
            console.log(_)
            drawFail()
        })
}
const toQR = () => {
    switch (targetType.value) {
        case 'text':
            if(textSource.value.trim() === '') drawFail('Empty Input!')
            else drawQR(textSource.value)
            break
        case 'url':
            if(address.value.trim() === '') drawFail('Empty Input!')
            else drawQR(`${ protocol.value }://${ address.value }`)
            break
        case 'image':
            if(imgSourceName.value === '') drawFail('Empty Input!')
            else drawQR(`https://lopo12123.github.io/qr-it/#/image-server?code=${ imgSourceBase64.value }`)
            break
    }
}
// endregion
</script>

<template>
    <div class="desktop-view with-scroll">
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
        <div class="text-source" v-if="targetType === 'text'">
            <div style="margin-bottom: 0.5rem">
                <b>words limit:</b>&nbsp;
                <i>{{ textSource.length }} / {{ textLimit[corrLevel] }}</i>
            </div>
            <textarea class="text-box" v-model="textSource" :maxlength="textLimit[corrLevel]"/>
        </div>

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
            <div class="image-source-picker" @click="selectImageSource">Select Image Source</div>
            <div class="image-source-name"><b>File Name:</b> {{ imgSourceName || 'UnSelected' }}</div>
        </div>
        <!-- endregion -->

        <!-- region custom -->
        <div class="custom-options">
            <div :class="configurationVisible ? 'configure-active' : 'configure-default'"
                 @click="configurationVisible = !configurationVisible">
                More Configuration
            </div>
            <div class="configure-box"
                 :style="configurationVisible
                 ? 'height: 15rem; margin-top: 1rem; border: solid 1px #7b7b7b;'
                 : 'height: 0; margin: 0; border: none;'">
                <div class="conf-line">
                    <span class="conf-label">dark area color</span>
                    <input class="color-picker" type="color" v-model="darkColor">
                </div>
                <div class="conf-line">
                    <span class="conf-label">light area color</span>
                    <input class="color-picker" type="color" v-model="lightColor">
                </div>
                <div class="conf-line">
                    <span class="conf-label">quiet zone width</span>
                    <input class="slider" type="range" v-model="strokeWidth" min="0" max="20" step="1">
                    <span style="margin-left: 0.5rem">{{ strokeWidth }}</span>
                </div>
                <div class="conf-line">
                    <span class="conf-label">error correction</span>
                    <div class="radios">
                        <span :class="corrLevel === 'L' ? 'radio-active' : 'radio-default'"
                              @click="setCorrLevel('L')">
                            low
                        </span>
                        <span :class="corrLevel === 'M' ? 'radio-active' : 'radio-default'"
                              @click="setCorrLevel('M')">
                            medium
                        </span>
                        <span :class="corrLevel === 'Q' ? 'radio-active' : 'radio-default'"
                              @click="setCorrLevel('Q')">
                            quartile
                        </span>
                        <span :class="corrLevel === 'H' ? 'radio-active' : 'radio-default'"
                              @click="setCorrLevel('H')">
                            high
                        </span>
                    </div>
                </div>
                <div class="conf-line">
                    <span class="conf-label">image (&lt1M)</span>
                    <div class="image-picker" @click="pickCenterImage">pick</div>
                    <span :class="['image-name', centerImageName === '' ? '' : 'clear-marker']"
                          title="click to remove"
                          @click="clearCenterImage">
                        {{ centerImageName || 'unused' }}
                    </span>
                </div>
            </div>
        </div>
        <!-- endregion -->

        <div class="fake-btn" @click="toQR">Generate QR Code</div>

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
    overflow: auto;

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
        margin: 1rem 0;
        color: #7b7b7b;

        .text-box {
            position: relative;
            width: 100%;
            height: 10rem;
            padding: 1rem;
            border: solid 1px #7b7b7b;
            border-radius: 0.5rem;
            outline: none;
            background-color: #f4f4f4;
            box-sizing: border-box;
            resize: none;
        }
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
        margin: 1rem 0;
        color: #7b7b7b;

        .image-source-picker {
            position: relative;
            width: 12rem;
            height: 2rem;
            border-radius: 1rem;
            background-color: #7b7b7b;
            color: #f4f4f4;
            text-align: center;
            line-height: 2rem;
            user-select: none;
            cursor: pointer;
        }

        .image-source-name {
            position: relative;
            width: 100%;
            height: 3rem;
            line-height: 3rem;
        }
    }

    // endregion

    .custom-options {
        position: relative;
        width: 100%;
        height: fit-content;
        margin: 1rem 0;

        %configure-btn {
            position: relative;
            width: calc(12rem - 2px);
            height: calc(2rem - 2px);
            border: solid 1px #7b7b7b;
            border-radius: 1rem;
            text-align: center;
            line-height: 2rem;
            user-select: none;
            cursor: pointer;
        }

        .configure-default {
            @extend %configure-btn;
            background-color: #f4f4f4;
            color: #7b7b7b;
        }

        .configure-active {
            @extend %configure-btn;
            background-color: #7b7b7b;
            color: #f4f4f4;
        }

        .configure-box {
            position: relative;
            width: 100%;
            border-radius: 1rem;
            box-sizing: border-box;
            background: #f4f4f4;
            color: #7b7b7b;
            overflow: hidden;
            transition: all 0.5s;

            .conf-line {
                position: relative;
                width: calc(100% - 2rem);
                height: 3rem;
                padding: 0 1rem;
                display: flex;
                align-items: center;
                justify-content: flex-start;

                .conf-label {
                    position: relative;
                    width: 10rem;
                    font-weight: bold;
                }

                .color-picker {
                    border: none;
                    outline: none;
                    cursor: pointer;
                }

                .slider {
                    -webkit-appearance: none;
                    height: 0.5rem;
                    border: solid 1px #7b7b7bcc;
                    border-radius: 0.25rem;
                    background-color: #f4f4f4;

                    &::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        width: 0.5rem;
                        height: 1rem;
                        border-radius: 0.5rem;
                        background: #7b7b7b80;
                        cursor: pointer;
                    }
                }

                .radios {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;

                    %radio {
                        position: relative;
                        width: calc(5rem - 2px);
                        height: calc(2rem - 2px);
                        border: solid 1px #7b7b7bcc;
                        user-select: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        &:first-child {
                            border-radius: 1rem 0 0 1rem;
                        }

                        &:last-child {
                            border-radius: 0 1rem 1rem 0;
                        }
                    }

                    .radio-default {
                        @extend %radio;
                        color: #7b7b7b;
                        background-color: #f4f4f4;
                    }

                    .radio-active {
                        @extend %radio;
                        color: #f4f4f4;
                        background-color: #7b7b7b;
                    }
                }

                .image-picker {
                    position: relative;
                    width: 5rem;
                    height: 2rem;
                    border-radius: 1rem;
                    background-color: #7b7b7b;
                    color: #f4f4f4;
                    text-align: center;
                    line-height: 2rem;
                    user-select: none;
                    cursor: pointer;
                }

                .image-name {
                    position: relative;
                    margin: 0 1rem;
                    color: #7b7b7b;
                    user-select: none;
                    cursor: pointer;

                }

                .clear-marker {
                    &::after {
                        content: "×";
                        margin-left: 0.5rem;
                    }
                }
            }
        }
    }

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
