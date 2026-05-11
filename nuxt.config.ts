// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
  nitro: {
    // 讓 server/audio/ 的音檔被打包進 server bundle（Vercel 相容）
    serverAssets: [
      { baseName: 'audio', dir: './server/audio' }
    ]
  }
})
