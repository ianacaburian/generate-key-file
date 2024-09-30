import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { JuceBigInteger } from './JuceBigInteger'
import { execTestBin } from './utils'

const hexArbitrary = fc.string({
    unit: fc.constantFrom(...'0123456789abcdef'),
    minLength: 300,
    maxLength: 1000
})

describe('JuceBigInteger', () => {
    it('divideBy', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
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
        let latest
        fc.assert(
            fc.property(
                fc.record({
                    dividendHex: hexArbitrary,
                    divisorHex: hexArbitrary
                }),
                input => {
                    const result = toResult(input)
                    latest = { input, result }
                    expect(result.fromJuce).toMatchObject(result.fromUtil)
                }
            )
        )
        console.log(latest)
    })

    it('exponentModulo', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
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
        // const baseString = `{"baseHex":"3","exponentHex":"8","modulusHex":"5"}`
        const baseString = `{"baseHex":"1400000007","exponentHex":"1400000006","modulusHex":"1400000005"}`
        const baseCase = JSON.parse(baseString)
        const baseResult = toResult(baseCase)
        console.log({ baseCase, baseResult })
        expect(baseResult.fromUtil.exponentModuloHex).toBe(
            baseResult.fromJuce.exponentModuloHex
        )
        let latest
        fc.assert(
            fc.property(
                fc.record({
                    baseHex: hexArbitrary,
                    exponentHex: hexArbitrary,
                    modulusHex: hexArbitrary
                }),
                input => {
                    const result = toResult(input)
                    latest = { input, result }
                    return (
                        result.fromUtil.exponentModuloHex ===
                        result.fromJuce.exponentModuloHex
                    )
                }
            )
        )
        console.log(latest)
    })
})
