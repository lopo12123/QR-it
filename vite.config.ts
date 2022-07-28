import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    build: {
        emptyOutDir: true,
        outDir: './docs',
        rollupOptions: {
            // output: {
            //     sourcemap: 'hidden'
            // },
            manualChunks: (id) => {
                if(id.includes('node_modules')) {
                    return (id.toString().split('node_modules/')[1].split('/')[0])
                }
            }
        }
    },
    plugins: [ vue() ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        }
    },
    server: {
        port: 30789,
    },
    css: {
        preprocessorOptions: {
            scss: {
                charset: false
            }
        }
    }
})
