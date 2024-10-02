import { JuceKeyGeneration } from './juce/JuceKeyGeneration'
import {
    GenerateExpiringKeyFileParams,
    generateExpiringKeyFileParamsValidator
} from './types'

export const generateExpiringKeyFile = (
    params: GenerateExpiringKeyFileParams,
    date: Date = new Date()
) => {
    const paramsParse = generateExpiringKeyFileParamsValidator.parse(params)
    return JuceKeyGeneration.generateExpiringKeyFile(paramsParse, date)
}
