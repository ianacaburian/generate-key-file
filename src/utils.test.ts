import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { ZodFastCheck } from 'zod-fast-check'

import {
    createKeyFileComment,
    createKeyFileContentLine,
    dateString,
    execTestBin,
    loadBigintFromUTF8
} from './utils'
import {
    CreateKeyFileCommentParams,
    CreateKeyFileContentLineParams,
    createKeyFileContentLineParamsValidator
} from './types'

describe('utils', () => {
    it('createKeyFileContentLine', ctx => {
        console.log(`Testing it ${ctx.task.name}...`)
        const toResult = (params: CreateKeyFileContentLineParams) => {
            const date = dateString.inHexMs(new Date())
            return {
                fromJuce: execTestBin(
                    'create-key-file-content-line',
                    JSON.stringify({ ...params, date })
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
        const baseResult = toResult(baseCase)
        console.log({ baseCase, baseResult })
        expect(baseResult.fromUtil).toBe(baseResult.fromJuce)
        const createKeyFileContentLineParamsArbitrary = ZodFastCheck().inputOf(
            createKeyFileContentLineParamsValidator
        )
        let latest
        fc.assert(
            fc.property(createKeyFileContentLineParamsArbitrary, input => {
                const result = toResult(input)
                latest = { input, result }
                const parse =
                    createKeyFileContentLineParamsValidator.safeParse(input)
                return !parse.success || result.fromUtil === result.fromJuce
            })
        )
        console.log(latest)
    })

    it('createKeyFileComment', ctx => {
        console.log(`Testing it ${ctx.task.name}...`)
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

    it('loadBigintFromUTF8', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        const toResult = (input: string) => ({
            fromJuce: execTestBin('load-big-integer-from-utf8', input),
            fromUtil: loadBigintFromUTF8(input).toString(16)
        })
        const baseCase = '0123'
        const baseResult = toResult(baseCase)
        console.log({ baseCase, baseResult })
        expect(baseResult.fromUtil).toBe(baseResult.fromJuce)
        let latest
        fc.assert(
            fc.property(
                fc.string({ minLength: 100, maxLength: 3000 }),
                input => {
                    const result = toResult(input)
                    latest = { input, result }
                    return result.fromUtil === result.fromJuce
                }
            )
        )
        console.log(latest)
    })
})
