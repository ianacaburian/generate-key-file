import {
    buildTextElement,
    escapeAttr,
    escapeText,
    unescapeXml
} from './juce/JuceXml'
import {
    BuildXmlTextElementParams,
    buildXmlTextElementParamsSchema,
    xmlStringSchema
} from './types'

export const escapeXmlText = (text: string): string =>
    escapeText(xmlStringSchema.parse(text))

export const escapeXmlAttribute = (value: string): string =>
    escapeAttr(xmlStringSchema.parse(value))

export const unescapeXmlText = (text: string): string =>
    unescapeXml(xmlStringSchema.parse(text))

export const buildXmlTextElement = (
    params: BuildXmlTextElementParams
): string => {
    const paramsParse = buildXmlTextElementParamsSchema.parse(params)
    return buildTextElement(paramsParse.tag, paramsParse.text)
}
