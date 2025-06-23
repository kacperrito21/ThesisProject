import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['vuetify/styles', '../src/styles/main.css'],
  build: {
    transpile: ['vuetify'],
  },
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@pinia/nuxt','@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'pl', iso: 'pl-PL', file: 'pl.json', name: 'Polski' }
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: '../src/locales/',
  }
})
