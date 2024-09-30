import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { JuceBigInteger } from './JuceBigInteger'
import { execTestBin } from './utils'

const hexArbitrary = fc.string({
    unit: fc.constantFrom(...'0123456789abcdef'),
    minLength: 30,
    maxLength: 100
})

describe('JuceBigInteger', () => {
    let test = 'divideBy'
    describe(test, () => {
        it('should perform division as juce does', () => {
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

    test = 'exponentModulo'
    describe(test, () => {
        it('should perform modular exponentiation as juce does', () => {
            console.log(`Testing ${test}...`)
            type TestParams = {
                baseHex: string
                exponentHex: string
                modulusHex: string
            }
            const toResult = (params: TestParams) => ({
                fromJuce: JSON.parse(
                    execTestBin('exponent-modulo', JSON.stringify(params))
                ),
                fromUtil: (() => {
                    const base = JuceBigInteger.fromHex(params.baseHex)
                    const exponent = JuceBigInteger.fromHex(params.exponentHex)
                    const modulus = JuceBigInteger.fromHex(params.modulusHex)
                    base.exponentModulo(exponent, modulus)
                    return {
                        exponentModuloHex: base.toHex()
                    }
                })()
            })
            const baseString = `{"baseHex":"3","exponentHex":"8","modulusHex":"5"}`
            // const baseString = `{"baseHex":"1400000007","exponentHex":"1400000006","modulusHex":"5"}`
            // const baseString = `{"baseHex":"20","exponentHex":"c","modulusHex":"18"}`
            const baseCase = JSON.parse(baseString)
            const baseResult = toResult(baseCase)
            console.log({ baseCase, baseResult })
            // expect(baseResult.fromJuce).toMatchObject(baseResult.fromUtil)
            // fc.assert(
            //     fc.property(
            //         fc.record({
            //             baseHex: hexArbitrary,
            //             exponentHex: hexArbitrary,
            //             modulusHex: hexArbitrary
            //         }),
            //         input => {
            //             const result = toResult(input)
            //             console.log({ input, result })
            //             return (
            //                 result.fromUtil.exponentModuloHex ===
            //                 result.fromJuce.exponentModuloHex
            //             )
            //         }
            //     ),
            //     { numRuns: 0, seed: 1 }
            // )
        })
    })
})
