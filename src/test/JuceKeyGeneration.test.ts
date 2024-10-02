import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { execTestBin } from 'src/test/test-utils'
import { ZodFastCheck } from 'zod-fast-check'
import {
    generateExpiringKeyFileParamsValidator,
    GenerateKeyFileParams
} from 'src/types'
import { JuceKeyGeneration } from 'src/juce/JuceKeyGeneration'
import { z } from 'zod'

describe('JuceKeyGeneration', () => {
    it('generateExpiringKeyFile', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        const appName = 'testProductId'
        const machineNumbers = 'testMachineId'
        type TestParams = {
            userEmail: string
            userName: string
            date: string
            publicKey: string
            privateKey: string
        }
        const toResult = (
            params: TestParams,
            count: bigint | undefined = undefined
        ) => {
            const date = new Date(params.date)
            const expiryTime = date
            const generateParams = {
                userEmail: params.userEmail,
                userName: params.userName,
                appName,
                machineNumbers,
                privateKey: params.privateKey,
                expiryTime
            }
            const keyFileContent = JuceKeyGeneration.generateExpiringKeyFile(
                generateParams,
                date
            )
            const applyResult = JSON.parse(
                execTestBin(
                    'apply-key-file',
                    JSON.stringify({
                        keyFileContent,
                        publicKey: params.publicKey,
                        count
                    })
                )
            )
            return {
                ...applyResult,
                generateParams,
                publicKey: params.publicKey,
                date
            }
        }
        const baseEmail = 'a@a.a'
        const baseDate = '2024-10-02T12:15:59.982Z'
        const basePublicKey =
            '11,92a747a6b9b2cde49f77c3488e116f0c5086ff4e94c14f97f7e55b15a57677bf'
        const basePrivateKey =
            '67852384bf5109ce8eaee433371b5d7100157e7a355412a04e3e8442e0bfc231,92a747a6b9b2cde49f77c3488e116f0c5086ff4e94c14f97f7e55b15a57677bf'
        const baseString =
            `{"userEmail":"${baseEmail}","userName":"","date":"${baseDate}",` +
            `"publicKey":"${basePublicKey}","privateKey":"${basePrivateKey}"}`
        const baseCase = JSON.parse(baseString)
        const baseResult = toResult({
            ...baseCase,
            publicKey: basePublicKey,
            privateKey: basePrivateKey
        })
        // console.log({ baseCase, baseResult })
        // expect(baseResult.unlockMessage).toBe('OK')
        // expect(baseResult.unlockEmail).toBe(baseEmail)
        // const generateExpiringKeyFileParamsArbitrary = ZodFastCheck().inputOf(
        //     generateExpiringKeyFileParamsValidator
        //         .omit({
        //             appName: true,
        //             machineNumbers: true
        //         })
        //         .extend({
        //             appName: z.literal(appName),
        //             machineNumbers: z.literal(machineNumbers)
        //         })
        // )
        // let latest
        // let count = 0n
        // fc.assert(
        //     fc.property(generateExpiringKeyFileParamsArbitrary, input => {
        //         count += 1n
        //         const result = toResult(input, count)
        //         latest = { input, result }
        //         const parse =
        //             generateExpiringKeyFileParamsValidator.safeParse(input)
        //         return (
        //             !parse.success ||
        //             (result.unlockMessage === 'OK' &&
        //                 result.unlockEmail === input.userEmail)
        //         )
        //     }),
        //     { numRuns: 0, seed: 1 }
        // )
        // console.log(latest)
    })
})
