import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // The GitHub repo is "Leons45/Webs" (capital W), so Pages serves this
  // from https://leons45.github.io/Webs/refraction/ — base must match that
  // exact case or the built script/stylesheet tags 404 silently and the
  // page renders pure white with nothing mounted.
  base: '/Webs/refraction/',
  plugins: [react()],
})
