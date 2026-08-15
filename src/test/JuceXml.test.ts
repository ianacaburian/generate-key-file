import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

import { buildTextElement, escapeText, unescapeXml } from '../juce/JuceXml'
import { execTestBin } from './test-utils'

const TAG = 'KEY_FILE'

const innerText = (element: string): string =>
    element.slice(`<${TAG}>`.length, element.length - `</${TAG}>`.length)

const fromJuceWriter = (text: string): string =>
    execTestBin('escape-xml-text', JSON.stringify({ tag: TAG, text }))

const fromJuceReader = (element: string): string =>
    JSON.parse(
        execTestBin('unescape-xml-text', JSON.stringify({ element }))
    ) as string

// A NUL ends juce's escape walk, and a juce::String carrying one truncates
// there as well, so the oracle cannot be handed text past a NUL to escape.
const textArbitrary = fc
    .string({ unit: 'binary', minLength: 1 })
    .filter(text => !text.includes('\0'))

// juce's PARSER normalises a carriage return in text content, which the
// inverse does not and must not: it decodes entities, it does not re-read the
// document. The case below pins that difference on its own.
const decodableTextArbitrary = textArbitrary.filter(
    text => !text.includes('\r')
)

describe('JuceXml', () => {
    it('escapeText matches juce for the base cases', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        const baseCases = [
            'plain text',
            "an apostrophe ' stays raw",
            'ampersand & quote " less < greater >',
            'accents àéî and CJK 漢字 and emoji 🎹',
            'line\nfeed and carriage\rreturn and a pair\r\nof them',
            'entity-looking &amp;lt; text'
        ]
        for (const text of baseCases) {
            const fromJuce = fromJuceWriter(text)
            const fromUtil = buildTextElement(TAG, text)
            console.log({ text, fromJuce, fromUtil })
            expect(fromUtil).toBe(fromJuce)
        }
    })

    it('escapeText matches juce for arbitrary text', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        let latest
        fc.assert(
            fc.property(textArbitrary, text => {
                const result = {
                    fromJuce: fromJuceWriter(text),
                    fromUtil: buildTextElement(TAG, text)
                }
                latest = { text, result }
                return result.fromUtil === result.fromJuce
            }),
            { numRuns: 50 }
        )
        console.log(latest)
    })

    it('escapeText stops at a NUL, as juce does', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        expect(escapeText('kept\0dropped')).toBe('kept')
        expect(escapeText('\0everything')).toBe('')
        expect(escapeText('kept & kept\0&')).toBe('kept &amp; kept')
    })

    it('unescapeXml matches juce for arbitrary escaped text', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        let latest
        fc.assert(
            fc.property(decodableTextArbitrary, text => {
                const element = fromJuceWriter(text)
                const result = {
                    fromJuce: fromJuceReader(element),
                    fromUtil: unescapeXml(innerText(element))
                }
                latest = { text, element, result }
                return result.fromUtil === result.fromJuce
            }),
            { numRuns: 50 }
        )
        console.log(latest)
    })

    it('a carriage return is written literally and lost on the way back', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        const baseCases = [
            { text: 'a\rb', throughJuce: 'a\nb' },
            { text: 'a\r\nb', throughJuce: 'a\nb' }
        ]
        for (const { text, throughJuce } of baseCases) {
            const element = fromJuceWriter(text)
            console.log({ text, element, throughJuce })
            expect(buildTextElement(TAG, text)).toBe(element)
            expect(fromJuceReader(element)).toBe(throughJuce)
            expect(unescapeXml(innerText(element))).toBe(text)
        }
    })

    it('unescapeXml takes everything juce reads back', ctx => {
        console.log(`Testing ${ctx.task.name}...`)
        const baseCases = [
            '&amp; &quot; &lt; &gt; &apos;',
            '&AMP; &Quot; &LT; &GT; &Apos;',
            '&#65;&#x42;&#X43;',
            '&#127929;',
            '&amp;lt;',
            'a bare & and a half-written &amp'
        ]
        for (const escaped of baseCases) {
            const element = `<${TAG}>${escaped}</${TAG}>`
            const fromJuce = fromJuceReader(element)
            const fromUtil = unescapeXml(escaped)
            console.log({ escaped, fromJuce, fromUtil })
            expect(fromUtil).toBe(fromJuce)
        }
    })
})
