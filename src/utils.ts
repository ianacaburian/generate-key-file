import { XMLBuilder } from 'fast-xml-parser'

export const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>'

export const dateString = {
    inHexMs: (date: Date): string => {
        // Ports juce::String::toHexString (juce::Time::getCurrentTime().toMilliseconds())
        return date.getTime().toString(16)
    },
    inFormattedComment: (date: Date): string => {
        // Ports `juce::Time::getCurrentTime().toString (true, true)`
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

export const createKeyFileContentSingleLine = (
    appName: string,
    userEmail: string,
    userName: string,
    machineNumbers: string,
    date: string = dateString.inHexMs(new Date())
): string => {
    const builder = new XMLBuilder({
        ignoreAttributes: false,
        format: true,
        suppressEmptyNode: true
    })
    const xml = {
        key: {
            '@_user': userName,
            '@_email': userEmail,
            '@_mach': machineNumbers,
            '@_app': appName,
            '@_date': date
        }
    }
    return [XML_DECLARATION, builder.build(xml).trim()].join(' ')
}

export const createKeyFileComment = (
    appName: string,
    userEmail: string,
    userName: string,
    machineNumbers: string,
    created: string = dateString.inFormattedComment(new Date())
): string =>
    `Keyfile for ${appName}\n` +
    `${userName ? `User: ${userName}\n` : ''}` +
    `Email: ${userEmail}\n` +
    `Machine numbers: ${machineNumbers}\n` +
    `Created: ${created}`

export const loadBigintFromUTF8 = (input: string): bigint =>
    BigInt(
        !input
            ? ''
            : '0x' +
                  Array.from(new TextEncoder().encode(input))
                      .reverse()
                      .map(b => b.toString(16))
                      .join('')
    )
