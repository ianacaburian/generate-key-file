import { resolve } from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: {
            src: resolve(__dirname, 'src')
        }
    },
    test: {
        setupFiles: ['./vitest.setup.js'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/cypress/**',
            '**/.{idea,git,cache,output,temp}/**',
            '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
            '**/build/**'
        ]
    },
})
