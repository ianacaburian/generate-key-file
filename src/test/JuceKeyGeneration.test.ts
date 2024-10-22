import { inspect } from 'util'
import fc from 'fast-check'
import { JuceKeyFileUtils } from 'src/juce/JuceKeyFileUtils'
import { JuceKeyGeneration } from 'src/juce/JuceKeyGeneration'
import { GenerateExpiringKeyFileParams } from 'src/types'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { ZodFastCheck } from 'zod-fast-check'

import { execTestBin } from './test-utils'

describe('JuceKeyGeneration', () => {
    const appName = 'testProductId'
    const machineNumbers = 'testMachineId'

    it('generateKeyFile', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        type TestParams = {
            userEmail: string
            userName: string
            publicKey: string
            privateKey: string
        }
        const toResult = (
            { userEmail, userName, publicKey, privateKey }: TestParams,
            count: bigint | undefined = undefined
        ) => {
            const generateParams = {
                userEmail,
                userName,
                appName,
                machineNumbers,
                privateKey
            }
            const keyFileContent = JuceKeyGeneration.generateKeyFile(
                generateParams,
                new Date('1970-01-01T00:00:00.000Z')
            )
            const applyResult = JSON.parse(
                execTestBin(
                    'apply-key-file',
                    JSON.stringify({
                        keyFileContent,
                        publicKey,
                        count: count ? count.toString() : undefined
                    })
                )
            )
            return {
                ...applyResult,
                generateParams,
                publicKey
            }
        }
        const baseEmail = 'a@a.a'
        const basePublicKey =
            '11,92a747a6b9b2cde49f77c3488e116f0c5086ff4e94c14f97f7e55b15a57677bf'
        const basePrivateKey =
            '67852384bf5109ce8eaee433371b5d7100157e7a355412a04e3e8442e0bfc231,92a747a6b9b2cde49f77c3488e116f0c5086ff4e94c14f97f7e55b15a57677bf'
        const baseString =
            `{"userEmail":"${baseEmail}","userName":"&",` +
            `"publicKey":"${basePublicKey}","privateKey":"${basePrivateKey}"}`
        const baseCase = JSON.parse(baseString)
        const baseResult = toResult({
            ...baseCase,
            publicKey: basePublicKey,
            privateKey: basePrivateKey
        })
        console.log({ baseCase, baseResult })
        expect(baseResult.unlockMessage).toBe('OK')
        expect(baseResult.unlockEmail).toBe(baseEmail)
        expect(baseResult.isUnlocked).toBe('UNLOCKED')
        let latest
        let count = 0n
        fc.assert(
            fc.property(
                fc.record({
                    userEmail: fc.string({ minLength: 100 }),
                    userName: fc.string({ minLength: 100 })
                }),
                input => {
                    count += 1n
                    const { publicKey, privateKey } = JSON.parse(
                        execTestBin('create-key-pair')
                    )
                    const params = {
                        ...input,
                        publicKey,
                        privateKey
                    }
                    const result = toResult(params, count)
                    latest = { input, result }
                    return (
                        result.unlockMessage === 'OK' &&
                        result.unlockEmail === input.userEmail &&
                        result.isUnlocked === 'UNLOCKED'
                    )
                }
            )
        )
        console.log(latest)
    })

    it('generateExpiringKeyFile', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        type TestParams = {
            userEmail: string
            userName: string
            publicKey: string
            privateKey: string
            expiryTime: string
        }
        const toResult = (
            params: TestParams,
            count: bigint | undefined = undefined
        ) => {
            const generateParams: GenerateExpiringKeyFileParams = {
                userEmail: params.userEmail,
                userName: params.userName,
                appName,
                machineNumbers,
                privateKey: params.privateKey,
                expiryTime: new Date(parseInt(params.expiryTime, 16))
            }
            const keyFileContent = JuceKeyGeneration.generateExpiringKeyFile(
                generateParams,
                new Date('1970-01-01T00:00:00.000Z')
            )
            const applyResult = JSON.parse(
                execTestBin(
                    'apply-key-file',
                    JSON.stringify({
                        keyFileContent,
                        publicKey: params.publicKey,
                        count: count ? count.toString() : undefined
                    })
                )
            )
            return {
                ...applyResult,
                generateParams,
                publicKey: params.publicKey
            }
        }
        const baseEmail = 'a@a.a'
        const baseName = '&'
        const baseExpiryTime = JuceKeyFileUtils.toHexStringMilliseconds(
            new Date('1970-01-01T00:00:00.001Z')
        )
        const basePublicKey =
            '11,92a747a6b9b2cde49f77c3488e116f0c5086ff4e94c14f97f7e55b15a57677bf'
        const basePrivateKey =
            '67852384bf5109ce8eaee433371b5d7100157e7a355412a04e3e8442e0bfc231,92a747a6b9b2cde49f77c3488e116f0c5086ff4e94c14f97f7e55b15a57677bf'
        const baseString =
            `{"userEmail":"${baseEmail}","userName":"${baseName}",` +
            `"expiryTime":"${baseExpiryTime}"}`
        const baseCase = JSON.parse(baseString)
        const baseResult = toResult({
            ...baseCase,
            publicKey: basePublicKey,
            privateKey: basePrivateKey
        })
        console.log({ baseCase, baseResult })
        expect(baseResult.unlockMessage).toBe('OK')
        expect(baseResult.unlockEmail).toBe(baseEmail)
        expect(baseResult.isUnlocked).toBe('LOCKED')
        expect(baseResult.unlockExpiryTime).toBe(baseExpiryTime)
        const arbitrary = ZodFastCheck()
            .inputOf(
                z.object({
                    userEmail: z.string(),
                    userName: z.string(),
                    expiryTime: z.date()
                })
            )
            .filter(
                input =>
                    input.userEmail.length > 0 &&
                    input.userName.length > 0 &&
                    input.expiryTime > new Date('1970-01-01T00:00:00.000Z')
            )
        let latest
        let count = 0n
        fc.assert(
            fc.property(arbitrary, input => {
                count += 1n
                const inputExpiryTimeString =
                    JuceKeyFileUtils.toHexStringMilliseconds(input.expiryTime)
                const { publicKey, privateKey } = JSON.parse(
                    execTestBin('create-key-pair')
                )
                const params = {
                    userEmail: input.userEmail,
                    userName: input.userName,
                    publicKey,
                    privateKey,
                    expiryTime: inputExpiryTimeString
                }
                const result = toResult(params, count)
                latest = { input, inputExpiryTimeString, result }
                return (
                    result.unlockMessage === 'OK' &&
                    result.unlockEmail === input.userEmail &&
                    result.isUnlocked === 'LOCKED' &&
                    result.unlockExpiryTime === inputExpiryTimeString
                )
            })
        )
        console.log({ latest })
    })
})
