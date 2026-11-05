import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))

/**
 * Vercel (et le worker) exposent souvent `ACCESS_*` sans le préfixe `VITE_`.
 * Vite n’envoie au client que les variables `VITE_*`, lues au build.
 * On recopie le nom sans préfixe seulement si `VITE_*` n’est pas déjà défini,
 * pour que la variable Vercel reste la source.
 */
const UNPREFIXED_ACCESS_KEYS = [
  'ACCESS_ADMIN',
  'ACCESS_FULL',
  'ACCESS_PARTIAL',
  'ACCESS_DOMAINS_ADMIN',
  'ACCESS_DOMAINS_FULL',
  'ACCESS_DOMAINS_PARTIAL',
  'FICHES_API_URL',
] as const

for (const name of UNPREFIXED_ACCESS_KEYS) {
  const viteKey = `VITE_${name}`
  const prefixed = process.env[viteKey]?.trim()
  const plain = process.env[name]?.trim()
  if (!prefixed && plain) process.env[viteKey] = plain
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
    },
  },
})
