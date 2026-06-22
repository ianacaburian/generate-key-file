import { JuceKeyGeneration } from './juce/JuceKeyGeneration'
import {
    GenerateExpiringKeyFileParams,
    generateExpiringKeyFileParamsSchema
} from './types'

export const generateExpiringKeyFile = (
    params: GenerateExpiringKeyFileParams,
    date: Date = new Date()
) => {
    const paramsParse = generateExpiringKeyFileParamsSchema.parse(params)
    return JuceKeyGeneration.generateExpiringKeyFile(paramsParse, date)
}
