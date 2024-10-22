import fc from 'fast-check'
import { JuceKeyFileUtils } from 'src/juce/JuceKeyFileUtils'
import { JuceRSAKey } from 'src/juce/JuceRSAKey'
import {
    CreateKeyFileCommentParams,
    createKeyFileCommentParamsValidator,
    CreateKeyFileContentLineParams,
    createKeyFileContentLineParamsValidator
} from 'src/types'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { ZodFastCheck } from 'zod-fast-check'

import { execTestBin, hexArbitrary } from './test-utils'

describe('JuceKeyFileUtils', () => {
    it('createKeyFileContentLine', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        type TestParams = CreateKeyFileContentLineParams & {
            date: string
        }
        const toResult = (params: TestParams) => {
            return {
                fromJuce: execTestBin(
                    'create-key-file-content-line',
                    JSON.stringify({ ...params })
                ),
                fromUtil: JuceKeyFileUtils.createKeyFileContentLine(
                    {
                        appName: params.appName,
                        userEmail: params.userEmail,
                        userName: params.userName,
                        machineNumbers: params.machineNumbers,
                        machineNumbersAttributeName:
                            params.machineNumbersAttributeName
                    },
                    params.date
                )
            }
        }
        const baseDate = JuceKeyFileUtils.toHexStringMilliseconds(
            new Date('1970-01-01T00:00:00.000Z')
        )
        const baseString =
            `{"appName":"'",` +
            `"userEmail":"a@a.a",` +
            `"userName":"&",` +
            `"machineNumbers":"\\"",` +
            `"machineNumbersAttributeName":"mach",` +
            `"date":"${baseDate}"}`
        const baseCase = JSON.parse(baseString)
        const baseResult = toResult(baseCase)
        console.log({ baseCase, baseResult })
        expect(baseResult.fromUtil).toBe(baseResult.fromJuce)
        const createKeyFileContentLineParamsArbitrary = ZodFastCheck().inputOf(
            createKeyFileContentLineParamsValidator.extend({
                date: z.date(),
                expiryTime: z.date()
            })
        )
        let latest
        fc.assert(
            fc.property(createKeyFileContentLineParamsArbitrary, input => {
                const result = toResult({
                    ...input,
                    date: JuceKeyFileUtils.toHexStringMilliseconds(input.date)
                })
                latest = { input, result }
                const parse =
                    createKeyFileContentLineParamsValidator.safeParse(input)
                return !parse.success || result.fromUtil === result.fromJuce
            })
        )
        console.log(latest)
    })

    it('createKeyFileComment', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        type TestParams = CreateKeyFileCommentParams & {
            created: string
        }
        const toResult = (params: TestParams) => {
            return {
                fromJuce: execTestBin(
                    'create-key-file-comment',
                    JSON.stringify({ ...params })
                ),
                fromUtil: JuceKeyFileUtils.createKeyFileComment(
                    params,
                    params.created
                )
            }
        }
        const baseDate = JuceKeyFileUtils.toString(
            new Date('1970-01-01T00:00:00.000Z')
        )
        const baseString =
            `{"appName":"'",` +
            `"userEmail":"a@a.a",` +
            `"userName":"&",` +
            `"machineNumbers":"\\"",` +
            `"created":"${baseDate}"}`
        const baseCase = JSON.parse(baseString)
        const baseResult = toResult(baseCase)
        console.log({ baseCase, baseResult })
        expect(baseResult.fromUtil).toBe(baseResult.fromJuce)
        const createKeyFileCommentParamsArbitrary = ZodFastCheck().inputOf(
            createKeyFileCommentParamsValidator.extend({
                created: z.date()
            })
        )
        let latest
        fc.assert(
            fc.property(createKeyFileCommentParamsArbitrary, input => {
                const result = toResult({
                    ...input,
                    created: JuceKeyFileUtils.toString(input.created)
                })
                latest = { input, result }
                const parse =
                    createKeyFileCommentParamsValidator.safeParse(input)
                return !parse.success || result.fromUtil === result.fromJuce
            })
        )
        console.log(latest)
    })

    it('encryptXMLLine', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        type TestParams = {
            xmlLine: string
            privateKeyString: string
        }
        const toResult = (params: TestParams) => ({
            fromJuce: JSON.parse(
                execTestBin('encrypt-xml-line', JSON.stringify(params))
            ),
            fromUtil: {
                encryptedXMLLine: JuceKeyFileUtils.encryptXMLLine(
                    params.xmlLine,
                    new JuceRSAKey(params.privateKeyString)
                )
            }
        })
        const baseString = `{"xmlLine":"'","privateKeyString":"6,4"}`
        const baseCase = JSON.parse(baseString)
        const baseResult = toResult(baseCase)
        console.log({ baseCase, baseResult })
        expect(baseResult.fromUtil.encryptedXMLLine).toBe(
            baseResult.fromJuce.encryptedXMLLine
        )
        let latest
        fc.assert(
            fc.property(
                fc.record({
                    xmlLine: fc.string({ minLength: 200 }),
                    privateKeyPart1Hex: hexArbitrary,
                    privateKeyPart2Hex: hexArbitrary
                }),
                input => {
                    const privateKeyString =
                        input.privateKeyPart1Hex +
                        ',' +
                        input.privateKeyPart2Hex
                    const result = toResult({
                        xmlLine: input.xmlLine,
                        privateKeyString
                    })
                    latest = { input, result }
                    return (
                        result.fromUtil.encryptedXMLLine ===
                        result.fromJuce.encryptedXMLLine
                    )
                }
            )
        )
        console.log(latest)
    })

    it('createKeyFile', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        type TestParams = {
            comment: string
            xmlLine: string
            privateKeyString: string
        }
        const toResult = (
            params: TestParams,
            count: bigint | undefined = undefined
        ) => ({
            fromJuce: JSON.parse(
                execTestBin(
                    'create-key-file',
                    JSON.stringify({
                        ...params,
                        count: count ? count.toString() : ''
                    })
                )
            ),
            fromUtil: {
                keyFile: JuceKeyFileUtils.createKeyFile(
                    params.comment,
                    params.xmlLine,
                    new JuceRSAKey(params.privateKeyString)
                )
            }
        })
        const baseCase = {
            comment: 'Expires: 02 Oct 2024 10:15:59pm',
            xmlLine:
                '<?xml version="1.0" encoding="UTF-8"?> <key user="&" email="a@a.a" expiring_mach="testMachineId" app="testProductId" date="1924d289bee" expiryTime="1924d289bee"/>',
            privateKeyString:
                '67852384bf5109ce8eaee433371b5d7100157e7a355412a04e3e8442e0bfc231,92a747a6b9b2cde49f77c3488e116f0c5086ff4e94c14f97f7e55b15a57677bf'
        }
        const baseResult = toResult(baseCase)
        console.log({ baseCase, baseResult })
        expect(baseResult.fromUtil.keyFile).toBe(baseResult.fromJuce.keyFile)
        let latest
        fc.assert(
            fc.property(
                fc.record({
                    comment: fc.string({ minLength: 200 }),
                    xmlLine: fc.string({ minLength: 200 }),
                    privateKeyPart1Hex: hexArbitrary,
                    privateKeyPart2Hex: hexArbitrary
                }),
                input => {
                    const privateKeyString =
                        input.privateKeyPart1Hex +
                        ',' +
                        input.privateKeyPart2Hex
                    const result = toResult({
                        comment: input.comment,
                        xmlLine: input.xmlLine,
                        privateKeyString
                    })
                    latest = { input, result }
                    return result.fromUtil.keyFile === result.fromJuce.keyFile
                }
            )
        )
        console.log(latest)
    })
})
