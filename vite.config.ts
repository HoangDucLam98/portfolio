import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/portfolio/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 20_000,
          groups: [
            {
              name: 'three-vendor',
              test: /node_modules[\\/](?:three|@react-three|maath)[\\/]/,
              maxSize: 450_000,
            },
          ],
        },
      },
    },
  },
})
