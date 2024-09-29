import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { execSync } from 'child_process'
import path from 'path'
import { JuceBigInteger } from './types'

const hexArbitrary = fc.string({
    unit: fc.constantFrom(...'0123456789abcdef'),
    minLength: 300,
    maxLength: 1000
})

const execTestBin = (bin: string, input: string): string =>
    execSync(path.join(__dirname, '..', 'test', 'bin', bin), {
        input,
        encoding: 'utf-8'
    }).trim()

describe('JuceBigInteger', () => {
    const test = 'divideBy'
    describe(test, () => {
        it('should parse between string and integer types', () => {
            console.log(`Testing ${test}...`)
            type TestParams = {
                dividendHex: string
                divisorHex: string
            }
            const toResult = (params: TestParams) => ({
                fromJuce: JSON.parse(
                    execTestBin('divide-by', JSON.stringify(params))
                ),
                fromUtil: (() => {
                    const dividend = JuceBigInteger.fromHex(params.dividendHex)
                    const divisor = JuceBigInteger.fromHex(params.divisorHex)
                    const remainder = new JuceBigInteger()
                    dividend.divideBy(divisor, remainder)
                    return {
                        quotientHex: dividend.toHex(),
                        remainderHex: remainder.toHex()
                    }
                })()
            })
            const baseString = `{"dividendHex":"a","divisorHex":"0"}`
            const baseCase = JSON.parse(baseString)
            const baseResult = toResult(baseCase)
            console.log({ baseCase, baseResult })
            expect(baseResult.fromJuce).toMatchObject(baseResult.fromUtil)
            fc.assert(
                fc.property(
                    fc.record({
                        dividendHex: hexArbitrary,
                        divisorHex: hexArbitrary
                    }),
                    input => {
                        const result = toResult(input)
                        console.log({ input, result })
                        expect(result.fromJuce).toMatchObject(result.fromUtil)
                    }
                )
            )
        })
    })
})
