import { JuceKeyGeneration } from './juce/JuceKeyGeneration'
import { GenerateKeyFileParams, generateKeyFileParamsValidator } from './types'

export const generateKeyFile = (
    params: GenerateKeyFileParams,
    date: Date = new Date()
) => {
    const paramsParse = generateKeyFileParamsValidator.parse(params)
    return JuceKeyGeneration.generateKeyFile(paramsParse, date)
}
