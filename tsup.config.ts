import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  banner: {
    js: '/*! typescript-mailbox-parser | MIT License | (c) 2025 Spencer Van Wessem Scorcelletti */',
  },
})
