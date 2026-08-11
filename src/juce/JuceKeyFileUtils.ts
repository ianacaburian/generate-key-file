import {
    CreateKeyFileCommentParams,
    CreateKeyFileContentLineParams
} from '../types'
import { JuceBigInteger } from './JuceBigInteger'
import { JuceRSAKey } from './JuceRSAKey'

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>'

const legalXmlCharRegex =
    // Ports juce::XmlOutputFunctions::LegalCharLookupTable
    /^[a-zA-Z0-9 .,;:\-()_+=?!$#@[\]/|*%~{}'\\]$/

const xmlAttributeCharProcessor = (char: string): string =>
    // Ports juce::XmlOutputFunctions::escapeIllegalXMLChars(), which walks
    // whole code points (getAndAdvance) and emits one numeric entity per
    // astral character - so iteration here must be by code point, never by
    // UTF-16 unit.
    char.length === 0
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
                  : `&#${char.codePointAt(0) ?? 0};`

const escapeAttr = (value: string): string =>
    // Ports juce::XmlOutputFunctions::escapeIllegalXMLChars()
    [...value].map(xmlAttributeCharProcessor).join('')

const buildElement = (tag: string, attrs: Record<string, string>): string => {
    // Builds <tag attr="val" .../> without delegating to fast-xml-parser,
    // which unconditionally escapes single quotes in attribute values in v5
    // — breaking the JUCE port (single quote is a legal char in JUCE XML).
    const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
        .join(' ')
    return `<${tag} ${attrStr}/>`
}

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
        const attrs: Record<string, string> = {
            user: userName,
            email: userEmail,
            [machineNumbersAttributeName]: machineNumbers,
            app: appName,
            date
        }
        if (expiryTime) attrs.expiryTime = expiryTime
        return [XML_DECLARATION, buildElement('key', attrs)].join(' ')
    }

    static createCustomKeyFileContentLine(
        rootTag: string,
        attributes: Record<string, string>
    ): string {
        // The generic sibling of createKeyFileContentLine: same declaration,
        // same single-space join, same JUCE escaping - only the tag and the
        // attribute set are the caller's.
        return [XML_DECLARATION, buildElement(rootTag, attributes)].join(' ')
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

    static decryptHexToMemoryBlock(hex: string, key: JuceRSAKey): Buffer {
        // Ports the decrypt half of juce::KeyFileUtils::getXmlFromKeyFile:
        // applyToValue is its own inverse under the paired key, so this
        // recovers whatever bytes the other side loaded and applied.
        const val = JuceBigInteger.fromHex(hex)
        key.applyToValue(val)
        return val.toMemoryBlock()
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
