import { JuceKeyGeneration } from './juce/JuceKeyGeneration'
import { GenerateKeyFileParams, generateKeyFileParamsSchema } from './types'

export const generateKeyFile = (
    params: GenerateKeyFileParams,
    date: Date = new Date()
) => {
    const paramsParse = generateKeyFileParamsSchema.parse(params)
    return JuceKeyGeneration.generateKeyFile(paramsParse, date)
}
