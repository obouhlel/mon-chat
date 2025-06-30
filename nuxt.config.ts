// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.NUXT_PUBLIC_SUPABASE_URL,
        key: process.env.NUXT_SUPABASE_ANON_KEY,
      }
    }
  },

  supabase: {
    redirect: false,
  },

  css: ['~/assets/css/main.css'],

  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/eslint",
    "@nuxtjs/supabase"
  ]
})