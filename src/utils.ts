import { XMLBuilder } from 'fast-xml-parser'

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>'

export const createKeyFileContentSingleLine = (
    appName: string,
    userEmail: string,
    userName: string,
    machineNumbers: string,
    machineNumbersAttributeName: string = 'mach'
): string => {
    const builder = new XMLBuilder({
        ignoreAttributes: false,
        format: true,
        suppressEmptyNode: true
    })
    const xmlObj = {
        key: {
            '@_user': userName,
            '@_email': userEmail,
            [`@_${machineNumbersAttributeName}`]: machineNumbers,
            '@_app': appName,
            '@_date': Date.now().toString(16)
        }
    }
    return `${XML_DECLARATION} ${builder.build(xmlObj)}`
}

export const createKeyFileComment = (
    appName: string,
    userEmail: string,
    userName: string,
    machineNumbers: string
): string =>
    `Keyfile for ${appName}\n` +
    `${userName ? `User: ${userName}\n` : ''}` +
    `Email: ${userEmail}\n` +
    `Machine numbers: ${machineNumbers}\n` +
    `Created: ${new Date().toLocaleString()}` // TODO match format with juce_KeyGeneration::generateKeyFile()

export const loadBigintFromText = (text: string): bigint => {
    return BigInt(0)
}
