import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { hexArbitrary, execTestBin } from 'src/test/test-utils'
import { JuceBigInteger } from 'src/juce/JuceBigInteger'
import { JuceRSAKey } from 'src/juce/JuceRSAKey'

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
            fromPort: (() => {
                const privateKey = new JuceRSAKey(params.privateKeyString)
                const val = JuceBigInteger.fromHex(params.valHex)
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
        expect(baseResult.fromPort.appliedValHex).toBe(
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
                        result.fromPort.appliedValHex ===
                        result.fromJuce.appliedValHex
                    )
                }
            )
        )
        console.log(latest)
    })
})
