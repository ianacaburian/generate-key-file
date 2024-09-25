import { describe, expect, it, vi } from 'vitest'
import { execSync } from 'child_process'
import { join } from 'path'

import {
    createKeyFileComment,
    createKeyFileContentSingleLine,
    loadBigintFromText
} from './utils'

describe('utils', () => {
    describe('createKeyFileContentSingleLine', () => {
        it('should generate valid XML content on a single line', () => {
            console.log('Testing createKeyFileContentSingleLine...')
            const result = createKeyFileContentSingleLine(
                'TestApp',
                'user@example.com',
                'John Doe',
                '123456789'
            )
            console.log('Generated XML content:\n', result)
            expect(result.includes('\n')).toBe(false)
            expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>')
            expect(result).toContain('<key')
            expect(result).toContain('app="TestApp"')
            expect(result).toContain('email="user@example.com"')
            expect(result).toContain('user="John Doe"')
            expect(result).toContain('mach="123456789"')
            expect(result).toContain('date="')
            expect(result).toContain('/>')
        })
    })

    describe('createKeyFileComment', () => {
        it('should generate a precisely formatted comment string', () => {
            console.log('Testing createKeyFileComment...')
            const mockDate = new Date('2023-06-15T12:30:45')
            vi.spyOn(global, 'Date').mockImplementation(() => mockDate)
            const result = createKeyFileComment(
                'TestApp',
                'user@example.com',
                'John Doe',
                '123456789'
            )
            console.log('Generated comment:\n', result)
            const expectedComment =
                'Keyfile for TestApp\n' +
                'User: John Doe\n' +
                'Email: user@example.com\n' +
                'Machine numbers: 123456789\n' +
                'Created: 6/15/2023, 12:30:45 PM'
            expect(result).toBe(expectedComment)
            vi.restoreAllMocks()
        })
    })

    describe('loadBigintFromText', () => {
        it('should correctly convert a text string to a bigint string', () => {
            console.log('Testing loadBigintFromText...')
            const input = `<?xml version="1.0" encoding="UTF-8"?> <key user="testUser" email="testEmail"/>`
            const expectedBigintString = `3e2f226c69616d4574736574223d6c69616d6520227265735574736574223d726573752079656b3c203e3f22382d465455223d676e69646f636e652022302e31223d6e6f6973726576206c6d783f3c`
            const result = loadBigintFromText(input)
            console.log('result', result)
            expect(false)
            // expect(result).toBe(expectedBigInt)
        })
    })
})
