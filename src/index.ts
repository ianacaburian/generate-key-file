export {
    type BuildXmlTextElementParams,
    type DecryptBytesParams,
    type GenerateCustomKeyFileParams,
    type GenerateKeyFileParams,
    type GenerateExpiringKeyFileParams
} from './types'

export { decryptBytes } from './decryptBytes'
export { generateCustomKeyFile } from './generateCustomKeyFile'
export { generateKeyFile } from './generateKeyFile'
export { generateExpiringKeyFile } from './generateExpiringKeyFile'
export {
    buildXmlTextElement,
    escapeXmlAttribute,
    escapeXmlText,
    unescapeXmlText
} from './xml'
