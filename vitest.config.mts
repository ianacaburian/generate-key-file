import { defineConfig } from 'vitest/config'

export default defineConfig({
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
    esbuild: {
        tsconfigRaw: '{"extends": "./tsconfig.vitest.json"}'
    }
})
