import pluginJs from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        ignores: [
            'dist/**',
            'test/**',
            '.cache/**',
            'public/**',
            'node_modules/**',
            '*.esm.js'
        ],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module'
            },
            globals: {
                ...globals.browser
            }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            prettier: prettierPlugin
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...prettierConfig.rules,
            ...prettierPlugin.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': 'off'
        }
    }
]
