import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'
import { imagetools } from 'vite-imagetools'

// The cloudflare plugin assumes the build target is a Worker entry; in SSR
// mode we're building a Node-loadable module for prerender, so disable it.
export default defineConfig(({ isSsrBuild }) => ({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), imagetools(), ...(isSsrBuild ? [] : [cloudflare()])],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
}))
