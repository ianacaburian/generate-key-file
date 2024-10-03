import { XMLBuilder } from 'fast-xml-parser'
import {
    CreateKeyFileCommentParams,
    CreateKeyFileContentLineParams
} from 'src/types'
import { JuceRSAKey } from './JuceRSAKey'
import { JuceBigInteger } from './JuceBigInteger'

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
    processEntities: false, // Disabled since it doesn't port to juce as is
    attributeValueProcessor: (_, value) => xmlAttributeValueProcessor(value)
})

export class JuceKeyFileUtils {
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
                '@_date': date, // Does not affect key file decryption
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
