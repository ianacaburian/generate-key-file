import { XMLBuilder } from 'fast-xml-parser'
import {
    CreateKeyFileCommentParams,
    CreateKeyFileContentLineParams,
    EncryptBigintParams
} from 'types'

export const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>'

export const legalXmlCharRegex =
    // Ports juce::XmlOutputFunctions::LegalCharLookupTable
    /^[a-zA-Z0-9 .,;:\-()_+=?!$#@[\]/|*%~{}'\\]$/

export const xmlAttributeCharProcessor = (char: string): string =>
    // Ports juce::XmlOutputFunctions::escapeIllegalXMLChars()
    char.length !== 1
        ? ''
        : legalXmlCharRegex.test(char)
          ? char
          : char === '&'
            ? '&amp;'
            : char === '"'
              ? '&quot;'
              : char === '>'
                ? '&gt;'
                : char === '<'
                  ? '&lt;'
                  : `&#${char.charCodeAt(0)};`

export const xmlAttributeValueProcessor = (value: unknown): string =>
    // Ports juce::XmlOutputFunctions::escapeIllegalXMLChars()
    typeof value !== 'string'
        ? ''
        : value.split('').map(xmlAttributeCharProcessor).join('')

export const xmlBuilder = new XMLBuilder({
    ignoreAttributes: false,
    suppressEmptyNode: true,
    processEntities: false, // Disabled since it doesn't mimic juce perfectly
    attributeValueProcessor: (_, value) => xmlAttributeValueProcessor(value)
})

export const dateString = {
    inHexMs: (date: Date): string => {
        // Ports juce::String::toHexString (juce::Time::getCurrentTime().toMilliseconds())
        return date.getTime().toString(16)
    },
    inFormattedComment: (date: Date): string => {
        // Ports juce::Time::getCurrentTime().toString (true, true)
        // prettier-ignore
        const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
        const day = date.getDate().toString().padStart(2, '0')
        const month = months[date.getMonth()]
        const year = date.getFullYear()
        let hours = date.getHours()
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')
        const ampm = hours >= 12 ? 'pm' : 'am'
        hours = hours % 12
        hours = hours ? hours : 12
        return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}${ampm}`
    }
}

export const createKeyFileContentLine = (
    {
        appName,
        userEmail,
        userName,
        machineNumbers,
        machineNumbersAttributeName
    }: CreateKeyFileContentLineParams,
    date: string = dateString.inHexMs(new Date())
): string => {
    // Ports juce::KeyFileUtils::createKeyFileContent
    // and juce::KeyFileUtils::encryptXML
    const xml = {
        key: {
            '@_user': userName,
            '@_email': userEmail,
            [`@_${machineNumbersAttributeName}`]: machineNumbers,
            '@_app': appName,
            '@_date': date // Does not affect key file decryption
        }
    }
    return [XML_DECLARATION, xmlBuilder.build(xml).trim()].join(' ')
}

export const createKeyFileComment = (
    {
        appName,
        userEmail,
        userName,
        machineNumbers
    }: CreateKeyFileCommentParams,
    created: string = dateString.inFormattedComment(new Date())
): string =>
    // Ports juce::KeyFileUtils::createKeyFileComment
    // Does not affect key file decryption
    `Keyfile for ${appName}\n` +
    `${userName ? `User: ${userName}\n` : ''}` +
    `Email: ${userEmail}\n` +
    `Machine numbers: ${machineNumbers}\n` +
    `Created: ${created}`

export const loadBigintFromUTF8 = (input: string): bigint => {
    // Ports juce::BigInteger::loadFromMemoryBlock()
    const buffer = Buffer.from(input, 'utf8')
    let result = 0n
    for (let i = buffer.length - 1; i >= 0; i--) {
        result = (result << 8n) | BigInt(buffer[i])
    }
    return result
}

export const encryptBigint = ({
    privateKey,
    val
}: EncryptBigintParams): string => {
    // Ports juce::RSAKey::RSAKey(), juce::RSAKey::applyToValue()
    // and juce::KeyFileUtils::encryptXML
    // Expected output depends on input validation by the caller
    // const [part1, part2] = privateKey.split(',').map(p => BigInt(`0x${p}`))
    // let result = 0n
    // let value = BigInt(val)

    // while (value !== 0n) {
    //     result *= part2

    //     let remainder = 0n
    //     value.divideBy(part2, remainder)

    //     remainder.exponentModulo(part1, part2)

    //     result += remainder
    // }

    // return result.toString(16)
    return ''
}
