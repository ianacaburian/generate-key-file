import { describe, expect, it, vi } from 'vitest'
import fc from 'fast-check'

import { execSync } from 'child_process'
import path from 'path'

import {
    createKeyFileComment,
    createKeyFileContentSingleLine,
    dateString
} from './utils'

const TEST_BIN_DIR = path.join(__dirname, '..', 'test', 'bin')

describe('utils', () => {
    let test = 'createKeyFileContentSingleLine'
    describe(test, () => {
        it('should generate valid XML content on a single line', () => {
            console.log(`Testing ${test}...`)
            const result = createKeyFileContentSingleLine(
                'TestApp',
                'user@example.com',
                'John Doe',
                '123456789',
                dateString.inHexMs(new Date('2024-06-28T04:45:35'))
            )
            console.log({ result })
            expect(result.includes('\n')).toBe(false)
            expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>')
            expect(result).toContain('<key')
            expect(result).toContain('app="TestApp"')
            expect(result).toContain('email="user@example.com"')
            expect(result).toContain('user="John Doe"')
            expect(result).toContain('mach="123456789"')
            expect(result).toContain('date="1905b046c98"')
            expect(result).toContain('/>')
        })
    })

    test = 'createKeyFileComment'
    describe(test, () => {
        it('should create a comment string, precisely formatted', () => {
            console.log(`Testing ${test}...`)
            const expected =
                'Keyfile for TestApp\n' +
                'User: John Doe\n' +
                'Email: user@example.com\n' +
                'Machine numbers: 123456789\n' +
                'Created: 28 Jun 2024 4:45:35am'
            const result = createKeyFileComment(
                'TestApp',
                'user@example.com',
                'John Doe',
                '123456789',
                dateString.inFormattedComment(new Date('2024-06-28T04:45:35'))
            )
            console.log({ result })
            expect(result).toBe(expected)
        })
    })

    test = 'loadBigintFromUTF8'
    describe(test, () => {
        it('should load a bigint from a UTF-8 string as juce does', () => {
            console.log(`Testing ${test}...`)
            const input = '0123'
            const expected = '33323130'
            const juce = path.join(TEST_BIN_DIR, 'load-big-integer-from-utf8')
            const result = {
                fromJuce: execSync(`${juce} "${input}"`, {
                    encoding: 'utf-8'
                }).trim()
            }
            console.log({ result })
            expect(result.fromJuce).toBe(expected)
        })
    })
})
