import { JuceKeyGeneration } from './juce/JuceKeyGeneration'
import {
    GenerateCustomKeyFileParams,
    generateCustomKeyFileParamsSchema
} from './types'

export const generateCustomKeyFile = (params: GenerateCustomKeyFileParams) => {
    const paramsParse = generateCustomKeyFileParamsSchema.parse(params)
    return JuceKeyGeneration.generateCustomKeyFile(paramsParse)
}
