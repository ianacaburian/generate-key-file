import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'], // Build for commonJS and ESmodules
    // tsup v8 hardcodes baseUrl:"." in its DTS build; ignoreDeprecations suppresses TS6's TS5101
    dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
    splitting: false,
    sourcemap: true,
    clean: true
})
