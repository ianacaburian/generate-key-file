import { GenerateExpiringKeyFileParams, GenerateKeyFileParams } from 'src/types'

import { JuceDateString } from './JuceDateString'
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
            JuceDateString.inHexMs(date)
        )
        const comment = JuceKeyFileUtils.createKeyFileComment(
            {
                appName: params.appName,
                userEmail: params.userEmail,
                userName: params.userName,
                machineNumbers: params.machineNumbers
            },
            JuceDateString.inFormattedComment(date)
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
            JuceDateString.inHexMs(date),
            JuceDateString.inHexMs(params.expiryTime)
        )
        const comment = JuceKeyFileUtils.createKeyFileComment(
            {
                appName: params.appName,
                userEmail: params.userEmail,
                userName: params.userName,
                machineNumbers: params.machineNumbers
            },
            JuceDateString.inFormattedComment(date),
            JuceDateString.inFormattedComment(params.expiryTime)
        )
        return JuceKeyFileUtils.createKeyFile(
            comment,
            xml,
            new JuceRSAKey(params.privateKey)
        )
    }
}
