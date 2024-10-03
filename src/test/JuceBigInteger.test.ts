import fc from 'fast-check'
import { JuceBigInteger } from 'src/juce/JuceBigInteger'
import { describe, expect, it } from 'vitest'

import { execTestBin, hexArbitrary } from './test-utils'

describe('JuceBigInteger', () => {
    it('fromUTF8MemoryBlock', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        const toResult = (input: string) => ({
            fromJuce: execTestBin('load-from-memory-block', input),
            fromPort: JuceBigInteger.fromUTF8MemoryBlock(input).toHex()
        })
        const baseCase = '0123'
        const baseResult = toResult(baseCase)
        console.log({ baseCase, baseResult })
        expect(baseResult.fromPort).toBe(baseResult.fromJuce)
        let latest
        fc.assert(
            fc.property(
                fc.string({ minLength: 100, maxLength: 3000 }),
                input => {
                    const result = toResult(input)
                    latest = { input, result }
                    return result.fromPort === result.fromJuce
                }
            )
        )
        console.log(latest)
    })

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
            fromPort: (() => {
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
        expect(baseResult.fromJuce).toMatchObject(baseResult.fromPort)
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
                    expect(result.fromJuce).toMatchObject(result.fromPort)
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
        const toResult = (
            params: TestParams,
            count: bigint | undefined = undefined
        ) => ({
            fromJuce: JSON.parse(
                execTestBin(
                    'exponent-modulo',
                    JSON.stringify({
                        ...params,
                        count: count ? count.toString() : ''
                    })
                )
            ),
            fromPort: (() => {
                const base = JuceBigInteger.fromHex(params.baseHex)
                const exponent = JuceBigInteger.fromHex(params.exponentHex)
                const modulus = JuceBigInteger.fromHex(params.modulusHex)
                base.exponentModulo(exponent, modulus)
                return {
                    exponentModuloHex: base.toHex()
                }
            })()
        })
        const baseString =
            `{"baseHex":"1400000007",` +
            `"exponentHex":"1400000006","modulusHex":"1400000005"}`
        const baseCase = JSON.parse(baseString)
        const baseResult = toResult(baseCase)
        console.log({ baseCase, baseResult })
        expect(baseResult.fromPort.exponentModuloHex).toBe(
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
                        result.fromPort.exponentModuloHex ===
                        result.fromJuce.exponentModuloHex
                    )
                }
            )
        )
        console.log(latest)
    })
})
