import { JuceKeyFileUtils } from './juce/JuceKeyFileUtils'
import { JuceRSAKey } from './juce/JuceRSAKey'
import { DecryptBytesParams, decryptBytesParamsSchema } from './types'

export const decryptBytes = (params: DecryptBytesParams): Buffer => {
    const paramsParse = decryptBytesParamsSchema.parse(params)
    return JuceKeyFileUtils.decryptHexToMemoryBlock(
        paramsParse.hexValue,
        new JuceRSAKey(paramsParse.key)
    )
}
