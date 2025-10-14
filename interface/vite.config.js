import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'Jano',
      short_name: 'Jano',
      description: 'Jano',
      theme_color: '#0a0a0f',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: true,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
    server: {
      host: true,
      proxy: {
        '/soletrando': {
          target: 'https://cathern-subhirsute-avelina.ngrok-free.dev',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/soletrando/, ''), // Mantenha a rota da API
        },
      },
    },
  }),
],
})