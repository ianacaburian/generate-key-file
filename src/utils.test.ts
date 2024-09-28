import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { execSync } from 'child_process'
import path from 'path'
import { ZodFastCheck } from 'zod-fast-check'

import {
    createKeyFileComment,
    createKeyFileContentLine,
    dateString,
    loadBigintFromUTF8
} from './utils'
import {
    CreateKeyFileCommentParams,
    CreateKeyFileContentLineParams,
    createKeyFileContentLineParamsValidator
} from './types'

const execTestBin = (bin: string, input: string): string =>
    execSync(path.join(__dirname, '..', 'test', 'bin', bin), {
        input,
        encoding: 'utf-8'
    }).trim()

describe('utils', () => {
    let test = 'createKeyFileContentLine and its validator'
    describe(test, () => {
        it('should create key file content on a single line as juce does', () => {
            console.log(`Testing ${test}...`)
            const toResult = (params: CreateKeyFileContentLineParams) => {
                const date = dateString.inHexMs(new Date())
                const input = JSON.stringify({ ...params, date })
                return {
                    fromJuce: execTestBin(
                        'create-key-file-content-line',
                        input
                    ),
                    fromUtil: createKeyFileContentLine(params, date)
                }
            }
            const baseString =
                `{"appName":"'",` +
                `"userEmail":"a@a.a",` +
                `"userName":"",` +
                `"machineNumbers":"\\"",` +
                `"machineNumbersAttributeName":"mach"}`
            const baseCase = JSON.parse(baseString)
            // Parsing baseCase from baseString for dx with counterexamples.
            const baseResult = toResult(baseCase)
            console.log({ baseCase, baseResult })
            expect(baseResult.fromUtil).toBe(baseResult.fromJuce)
            const createKeyFileContentLineParamsArbitrary =
                ZodFastCheck().inputOf(createKeyFileContentLineParamsValidator)
            fc.assert(
                fc.property(createKeyFileContentLineParamsArbitrary, input => {
                    const result = toResult(input)
                    console.log({ input, result })
                    const parse =
                        createKeyFileContentLineParamsValidator.safeParse(input)
                    return !parse.success || result.fromUtil === result.fromJuce
                }),
                {
                    numRuns: 0
                }
            )
        })
    })

    test = 'createKeyFileComment'
    describe(test, () => {
        it('should create a key file comment as juce does', () => {
            console.log(`Testing ${test}...`)
            const input = {
                appName: 'TestApp',
                userEmail: 'user@example.com',
                userName: 'John Doe',
                machineNumbers: '123456789'
            } as CreateKeyFileCommentParams
            const result = createKeyFileComment(
                input,
                dateString.inFormattedComment(new Date('2024-06-28T04:45:35'))
            )
            console.log({ input, result })
            const expected =
                'Keyfile for TestApp\n' +
                'User: John Doe\n' +
                'Email: user@example.com\n' +
                'Machine numbers: 123456789\n' +
                'Created: 28 Jun 2024 4:45:35am'
            expect(result).toBe(expected)
        })
    })

    test = 'loadBigintFromUTF8'
    describe(test, () => {
        it('should load a bigint from a UTF8 string as juce does', () => {
            console.log(`Testing ${test}...`)
            const toResult = (input: string) => ({
                fromJuce: execTestBin('load-big-integer-from-utf8', input),
                fromUtil: loadBigintFromUTF8(input).toString(16)
            })
            const baseCase = '0123'
            const baseResult = toResult(baseCase)
            console.log({ baseCase, baseResult })
            expect(baseResult.fromUtil).toBe(baseResult.fromJuce)
            fc.assert(
                fc.property(
                    fc.string({ minLength: 100, maxLength: 3000 }),
                    input => {
                        const result = toResult(input)
                        console.log({ input, result })
                        return result.fromUtil === result.fromJuce
                    }
                ),
                {
                    numRuns: 10
                }
            )
        })
    })
})
