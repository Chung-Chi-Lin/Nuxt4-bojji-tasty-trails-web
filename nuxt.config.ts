// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    'leaflet/dist/leaflet.css',
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    // Server only → NUXT_SUPABASE_SECRET_KEY
    supabaseSecretKey: '',
    public: {
      // Client + Server → NUXT_PUBLIC_SUPABASE_URL / NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      supabaseUrl: '',
      supabasePublishableKey: '',
    }
  }
})
