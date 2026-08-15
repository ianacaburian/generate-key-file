const legalXmlCharRegex =
    // Ports juce::XmlOutputFunctions::LegalCharLookupTable
    /^[a-zA-Z0-9 .,;:\-()_+=?!$#@[\]/|*%~{}'\\]$/

const XML_NAMED_ENTITIES: Record<string, string | undefined> = {
    // Ports the named entities juce::XmlDocument::readEntity accepts. apos is
    // read but never written: the single quote is a legal char above, so juce
    // emits it raw.
    amp: '&',
    quot: '"',
    apos: "'",
    lt: '<',
    gt: '>'
}

const XML_ENTITY_PATTERN = /&(#[xX][0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/g

const MAX_CODE_POINT = 0x10ffff

const beforeFirstNul = (text: string): string => {
    // Ports the loop break in juce::XmlOutputFunctions::
    // escapeIllegalXmlChars(): a NUL ends the walk, so juce escapes nothing
    // past the first one and NEVER emits &#0;. Emitting that entity instead
    // would not merely be illegal by the spec - juce's own parser decodes it
    // by appending a NUL to a juce::String, truncating the value it has just
    // read.
    const nul = text.indexOf('\0')
    return nul < 0 ? text : text.slice(0, nul)
}

const xmlCharProcessor = (char: string, changeNewLines: boolean): string =>
    legalXmlCharRegex.test(char)
        ? char
        : char === '&'
          ? '&amp;'
          : char === '"'
            ? '&quot;'
            : char === '>'
              ? '&gt;'
              : char === '<'
                ? '&lt;'
                : (char === '\n' || char === '\r') && !changeNewLines
                  ? char
                  : `&#${char.codePointAt(0) ?? 0};`

const codePointFromEntity = (entity: string): number =>
    entity[1] === 'x' || entity[1] === 'X'
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10)

const namedEntity = (name: string, match: string): string =>
    XML_NAMED_ENTITIES[name.toLowerCase()] ?? match

const fromCodePointOrRaw = (codePoint: number, match: string): string =>
    // juce casts the parsed value to juce_wchar and appends whatever it is;
    // javascript throws above 0x10FFFF instead. Nothing juce writes can land
    // here, since its own escape only ever emits a real code point, so the
    // out-of-range case means a hand-mangled file - and leaving the reference
    // untouched is what stops one from throwing.
    codePoint <= MAX_CODE_POINT ? String.fromCodePoint(codePoint) : match

export const escapeIllegalXmlChars = (
    text: string,
    changeNewLines: boolean
): string =>
    // Ports juce::XmlOutputFunctions::escapeIllegalXmlChars(), which walks
    // whole code points (getAndAdvance) and emits one numeric entity per
    // astral character - so iteration here must be by code point, never by
    // UTF-16 unit.
    [...beforeFirstNul(text)]
        .map(char => xmlCharProcessor(char, changeNewLines))
        .join('')

export const escapeAttr = (value: string): string =>
    // Ports the attribute-value call in juce::XmlElement::writeElementAsText,
    // changeNewLines TRUE (juce_XmlElement.cpp line 294), so a newline inside
    // an attribute becomes &#10; or &#13;.
    escapeIllegalXmlChars(value, true)

export const escapeText = (text: string): string =>
    // Ports the text-content calls in juce::XmlElement::writeElementAsText,
    // changeNewLines FALSE (juce_XmlElement.cpp lines 309 and 341), so \n and
    // \r pass through literally.
    //
    // That does NOT make a CRLF layout survive a round trip. juce's parser
    // normalises text content on the way back in: a lone \r becomes \n, and a
    // \r\n pair collapses to one \n (juce_XmlDocument.cpp line 651). Only an
    // entity comes back as a CR, and juce never writes one here, so neither
    // does this.
    escapeIllegalXmlChars(text, false)

export const unescapeXml = (text: string): string =>
    // Ports juce::XmlDocument::readEntity (juce_XmlDocument.cpp line 681).
    // There is no paired decode function in juce to port - it decodes inside
    // the parser - so the parser IS the specification, and it accepts MORE
    // than the escape above emits: &apos;, hex references, and entity names
    // matched case-insensitively.
    //
    // One pass matters. Decoding the named entities and the numeric ones in
    // separate passes would turn a literal &amp;lt; into a less-than sign.
    text.replace(XML_ENTITY_PATTERN, (match: string, entity: string) =>
        entity.startsWith('#')
            ? fromCodePointOrRaw(codePointFromEntity(entity), match)
            : namedEntity(entity, match)
    )

export const buildElement = (
    tag: string,
    attrs: Record<string, string>
): string => {
    // Builds <tag attr="val" .../> without delegating to fast-xml-parser,
    // which unconditionally escapes single quotes in attribute values in v5
    // — breaking the JUCE port (single quote is a legal char in JUCE XML).
    const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
        .join(' ')
    return `<${tag} ${attrStr}/>`
}

export const buildTextElement = (tag: string, text: string): string =>
    // Ports the text-child branch of juce::XmlElement::writeElementAsText: an
    // element carrying a text child writes the open tag, the escaped text and
    // the close tag, with no indentation and no line breaks under
    // TextFormat().singleLine(). An element with NO children writes <tag/>
    // instead, but addTextElement makes one even for an empty string, so this
    // pair is what juce produces either way.
    `<${tag}>${escapeText(text)}</${tag}>`
