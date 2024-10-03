import { execSync } from 'child_process'
import crypto from 'crypto'
import os from 'os'
import path from 'path'
import fc from 'fast-check'

export const hexArbitrary = fc.string({
    unit: fc.constantFrom(...'0123456789abcdef'),
    minLength: 300,
    maxLength: 1000
})

export const rsaKeyArbitrary = fc.string({
    unit: fc.constantFrom(...'0123456789abcdef'),
    minLength: 300,
    maxLength: 1000
})

export const execTestBin = (bin: string, input?: string): string => {
    try {
        return execSync(path.join(__dirname, '..', '..', 'test', 'bin', bin), {
            input,
            encoding: 'utf-8'
        }).trim()
    } catch (error) {
        console.error(`execSync "${bin}":`, error)
        throw error
    }
}
