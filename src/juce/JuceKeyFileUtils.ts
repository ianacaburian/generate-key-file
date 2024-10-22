import { XMLBuilder } from 'fast-xml-parser'
import {
    CreateKeyFileCommentParams,
    CreateKeyFileContentLineParams
} from 'src/types'

import { JuceBigInteger } from './JuceBigInteger'
import { JuceRSAKey } from './JuceRSAKey'

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>'

const legalXmlCharRegex =
    // Ports juce::XmlOutputFunctions::LegalCharLookupTable
    /^[a-zA-Z0-9 .,;:\-()_+=?!$#@[\]/|*%~{}'\\]$/

const xmlAttributeCharProcessor = (char: string): string =>
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

const xmlAttributeValueProcessor = (value: unknown): string =>
    // Ports juce::XmlOutputFunctions::escapeIllegalXMLChars()
    typeof value !== 'string'
        ? ''
        : value.split('').map(xmlAttributeCharProcessor).join('')

const xmlBuilder = new XMLBuilder({
    ignoreAttributes: false,
    suppressEmptyNode: true,
    // processEntities is disabled since it doesn't port to juce as is
    processEntities: false,
    attributeValueProcessor: (_, value) => xmlAttributeValueProcessor(value)
})

export class JuceKeyFileUtils {
    static toString(date: Date): string {
        // Ports juce::Time::getCurrentTime().toString (true, true)
        // prettier-ignore
        const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
        const day = date.getDate().toString()
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

    static toHexStringMilliseconds(date: Date): string {
        // Ports juce::String::toHexString (juce::Time::getCurrentTime().toMilliseconds())
        return date.getTime().toString(16)
    }

    static createKeyFileContentLine(
        {
            appName,
            userEmail,
            userName,
            machineNumbers,
            machineNumbersAttributeName
        }: CreateKeyFileContentLineParams,
        date: string,
        expiryTime?: string
    ): string {
        // Ports juce::KeyFileUtils::createKeyFileContent
        // and juce::KeyFileUtils::encryptXML
        const xml = {
            key: {
                '@_user': userName,
                '@_email': userEmail,
                [`@_${machineNumbersAttributeName}`]: machineNumbers,
                '@_app': appName,
                '@_date': date,
                ...(expiryTime ? { '@_expiryTime': expiryTime } : {})
            }
        }
        return [XML_DECLARATION, xmlBuilder.build(xml).trim()].join(' ')
    }

    static createKeyFileComment(
        {
            appName,
            userEmail,
            userName,
            machineNumbers
        }: CreateKeyFileCommentParams,
        created: string,
        expiryTime?: string
    ): string {
        // Ports juce::KeyFileUtils::createKeyFileComment
        return (
            `Keyfile for ${appName}\r\n` +
            `${userName ? `User: ${userName}\r\n` : ''}` +
            `Email: ${userEmail}\r\n` +
            `Machine numbers: ${machineNumbers}\r\n` +
            `Created: ${created}` +
            (expiryTime ? `\r\nExpires: ${expiryTime}` : '')
        )
    }

    static encryptXMLLine(xmlLine: string, privateKey: JuceRSAKey): string {
        // Ports juce::KeyFileUtils::encryptXML
        const val = JuceBigInteger.fromUTF8MemoryBlock(xmlLine)
        privateKey.applyToValue(val)
        return val.toHex()
    }

    static createKeyFile(
        comment: string,
        xmlLine: string,
        rsaPrivateKey: JuceRSAKey
    ): string {
        // Ports juce::KeyFileUtils::createKeyFile
        let asHex = '#' + this.encryptXMLLine(xmlLine, rsaPrivateKey)

        const lines: string[] = []
        lines.push(comment)
        lines.push('')

        const charsPerLine = 70
        while (asHex.length > 0) {
            lines.push(asHex.substring(0, charsPerLine))
            asHex = asHex.substring(charsPerLine)
        }

        lines.push('')

        return lines.join('\r\n')
    }
}
