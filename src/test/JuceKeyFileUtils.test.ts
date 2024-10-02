import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { execTestBin } from 'src/test/test-utils'
import { ZodFastCheck } from 'zod-fast-check'

import { createKeyFileContentLine } from '../juce/JuceKeyFileUtils'
import {
    CreateKeyFileContentLineParams,
    createKeyFileContentLineParamsValidator
} from 'src/types'
import { JuceDateString } from 'src/juce/JuceDateString'

describe('JuceKeyFileUtils', () => {
    it('createKeyFileContentLine', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        const toResult = (params: CreateKeyFileContentLineParams) => {
            const date = JuceDateString.inHexMs(new Date())
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
})
