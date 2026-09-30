import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves this from /portfolio/, not the domain root, so every
// built asset path needs that prefix. Dev keeps '/' so `npm run dev` is
// unaffected. Anything referencing /public must go through
// import.meta.env.BASE_URL rather than an absolute "/..." path, or it will
// 404 once deployed.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/portfolio/' : '/',
  plugins: [react(), tailwindcss()],
}))