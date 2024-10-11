import fc from 'fast-check'
import { JuceDateString } from 'src/juce/JuceDateString'
import { JuceKeyGeneration } from 'src/juce/JuceKeyGeneration'
import { describe, expect, it } from 'vitest'

import { execTestBin } from './test-utils'

describe('JuceKeyGeneration', () => {
    type TestParams = {
        userEmail: string
        userName: string
        dateString: string
        publicKey: string
        privateKey: string
    }
    const appName = 'testProductId'
    const machineNumbers = 'testMachineId'

    it('generateKeyFile', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        const toResult = (
            {
                userEmail,
                userName,
                dateString,
                publicKey,
                privateKey
            }: TestParams,
            count: bigint | undefined = undefined
        ) => {
            const date = new Date(dateString)
            const generateParams = {
                userEmail,
                userName,
                appName,
                machineNumbers,
                privateKey
            }
            const keyFileContent = JuceKeyGeneration.generateKeyFile(
                generateParams,
                date
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
                publicKey,
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
            `{"userEmail":"${baseEmail}","userName":"&",` +
            `"dateString":"${baseDate}",` +
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
                    const dateString = JuceDateString.inHexMs(new Date())
                    const params = {
                        ...input,
                        publicKey,
                        privateKey,
                        dateString
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
        const toResult = (
            {
                userEmail,
                userName,
                dateString,
                publicKey,
                privateKey
            }: TestParams,
            count: bigint | undefined = undefined
        ) => {
            const date = new Date(dateString)
            const expiryTime = date
            const generateParams = {
                userEmail,
                userName,
                appName,
                machineNumbers,
                privateKey,
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
                        publicKey,
                        count: count ? count.toString() : undefined
                    })
                )
            )
            return {
                ...applyResult,
                generateParams,
                publicKey,
                date
            }
        }
        const baseEmail = 'a@a.a'
        const baseName = '&'
        const now = new Date()
        const baseDate = now.toISOString()
        const basePublicKey =
            '11,92a747a6b9b2cde49f77c3488e116f0c5086ff4e94c14f97f7e55b15a57677bf'
        const basePrivateKey =
            '67852384bf5109ce8eaee433371b5d7100157e7a355412a04e3e8442e0bfc231,92a747a6b9b2cde49f77c3488e116f0c5086ff4e94c14f97f7e55b15a57677bf'
        const baseString =
            `{"userEmail":"${baseEmail}","userName":"${baseName}",` +
            `"dateString":"${baseDate}",` +
            `"publicKey":"${basePublicKey}","privateKey":"${basePrivateKey}"}`
        const baseCase = JSON.parse(baseString)
        const baseResult = toResult({
            ...baseCase,
            publicKey: basePublicKey,
            privateKey: basePrivateKey
        })
        console.log({ baseCase, baseResult })
        expect(baseResult.unlockEmail).toBe(baseEmail)
        expect(baseResult.isUnlocked).toBe('LOCKED')
        expect(baseResult.unlockExpiryTime).toBe(
            JuceDateString.inHexMs(new Date(baseDate))
        )
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
                    const date = new Date()
                    const params = {
                        userEmail: input.userEmail,
                        userName: input.userName,
                        publicKey,
                        privateKey,
                        dateString: date.toISOString()
                    }
                    const result = toResult(params, count)
                    latest = { input, result }
                    return (
                        result.unlockMessage === 'OK' &&
                        result.unlockEmail === input.userEmail &&
                        result.isUnlocked === 'LOCKED' &&
                        result.unlockExpiryTime === JuceDateString.inHexMs(date)
                    )
                }
            )
        )
        console.log(latest)
    })
})
