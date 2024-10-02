import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { hexArbitrary, execTestBin } from './test-utils'
import { JuceBigInteger } from './JuceBigInteger'
import { JuceRSAKey } from './JuceRSAKey'

describe('JuceRSAKey', () => {
    it('applyToValue', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        type TestParams = {
            privateKeyString: string
            valHex: string
        }
        const toResult = (
            params: TestParams,
            count: bigint | undefined = undefined
        ) => ({
            fromJuce: JSON.parse(
                execTestBin(
                    'apply-to-value',
                    JSON.stringify({
                        ...params,
                        count: count ? count.toString() : ''
                    })
                )
            ),
            fromUtil: (() => {
                const privateKey = new JuceRSAKey(params.privateKeyString)
                let val = JuceBigInteger.fromHex(params.valHex)
                privateKey.applyToValue(val)
                return {
                    appliedValHex: val.toHex()
                }
            })()
        })
        const baseString = `{"privateKeyString":"3,4","valHex":"8"}`
        const baseCase = JSON.parse(baseString)
        const baseResult = toResult(baseCase)
        console.log({ baseCase, baseResult })
        expect(baseResult.fromUtil.appliedValHex).toBe(
            baseResult.fromJuce.appliedValHex
        )
        let latest
        fc.assert(
            fc.property(
                fc.record({
                    privateKeyPart1Hex: hexArbitrary,
                    privateKeyPart2Hex: hexArbitrary,
                    valHex: hexArbitrary
                }),
                input => {
                    const privateKeyString =
                        input.privateKeyPart1Hex +
                        ',' +
                        input.privateKeyPart2Hex
                    const result = toResult({
                        privateKeyString,
                        valHex: input.valHex
                    })
                    latest = { input, result }
                    return (
                        result.fromUtil.appliedValHex ===
                        result.fromJuce.appliedValHex
                    )
                }
            )
        )
        console.log(latest)
    })
})
