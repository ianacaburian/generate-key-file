import { GenerateExpiringKeyFileParams, GenerateKeyFileParams } from 'src/types'

import { JuceKeyFileUtils } from './JuceKeyFileUtils'
import { JuceRSAKey } from './JuceRSAKey'

export class JuceKeyGeneration {
    static generateKeyFile(
        params: GenerateKeyFileParams,
        date: Date = new Date()
    ) {
        const xml = JuceKeyFileUtils.createKeyFileContentLine(
            {
                appName: params.appName,
                userEmail: params.userEmail,
                userName: params.userName,
                machineNumbers: params.machineNumbers,
                machineNumbersAttributeName: 'mach'
            },
            JuceKeyFileUtils.toHexStringMilliseconds(date)
        )
        const comment = JuceKeyFileUtils.createKeyFileComment(
            {
                appName: params.appName,
                userEmail: params.userEmail,
                userName: params.userName,
                machineNumbers: params.machineNumbers
            },
            JuceKeyFileUtils.toString(date)
        )
        return JuceKeyFileUtils.createKeyFile(
            comment,
            xml,
            new JuceRSAKey(params.privateKey)
        )
    }

    static generateExpiringKeyFile(
        params: GenerateExpiringKeyFileParams,
        date: Date = new Date()
    ) {
        const xml = JuceKeyFileUtils.createKeyFileContentLine(
            {
                appName: params.appName,
                userEmail: params.userEmail,
                userName: params.userName,
                machineNumbers: params.machineNumbers,
                machineNumbersAttributeName: 'expiring_mach'
            },
            JuceKeyFileUtils.toHexStringMilliseconds(date),
            JuceKeyFileUtils.toHexStringMilliseconds(params.expiryTime)
        )
        const comment = JuceKeyFileUtils.createKeyFileComment(
            {
                appName: params.appName,
                userEmail: params.userEmail,
                userName: params.userName,
                machineNumbers: params.machineNumbers
            },
            JuceKeyFileUtils.toString(date),
            JuceKeyFileUtils.toString(params.expiryTime)
        )
        return JuceKeyFileUtils.createKeyFile(
            comment,
            xml,
            new JuceRSAKey(params.privateKey)
        )
    }
}
