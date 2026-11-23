import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: { chunkSizeWarningLimit: 1500 },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Juego Rafa',
        short_name: 'JuegoRafa',
        description: 'Plataformas educativo para niños de 4 a 6 años',
        lang: 'es',
        display: 'fullscreen',
        orientation: 'landscape',
        background_color: '#9BB4FF',
        theme_color: '#9BB4FF',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,png,svg,json,mp3,ogg}'] },
    }),
  ],
});
