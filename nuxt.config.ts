// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/ui', "@vueuse/nuxt"],
    css: ["~/assets/main.css"],

    routeRules: {
        "/wordle": {
            ssr: false
        }
    },

    icon: {
        provider: 'iconify',
        serverBundle: false,
    },

    fonts: {
        families: [
            { name: 'Lexend', provider: 'google' },
        ]
    },

    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
})