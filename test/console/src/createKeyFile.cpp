#include <juce_cryptography/juce_cryptography.h>

static auto
encryptXMLLine(
    juce::String const &xmlLineParam, juce::RSAKey const &privateKey
) noexcept {
    // Taken from juce::KeyFileUtils::encryptXML()
    using namespace juce;

    MemoryOutputStream text;
    text << xmlLineParam;

    BigInteger val;
    val.loadFromMemoryBlock(text.getMemoryBlock());

    privateKey.applyToValue(val);

    return val.toString(16);
}

static auto
createKeyFile(
    juce::String const &commentParam, juce::String const &xmlLineParam,
    juce::String const &privateKeyStringParam
) noexcept {
    // Taken from juce::KeyFileUtils::createKeyFile()
    using namespace juce;
    auto const privateKey       = juce::RSAKey{privateKeyStringParam};
    auto const privateKeyString = privateKey.toString();

    String asHex("#" + encryptXMLLine(xmlLineParam, privateKey));

    StringArray lines;
    lines.add(commentParam);
    lines.add(String());

    int const charsPerLine = 70;
    while (asHex.length() > 0) {
        lines.add(asHex.substring(0, charsPerLine));
        asHex = asHex.substring(charsPerLine);
    }

    lines.add(String());

    auto const keyFile = lines.joinIntoString("\r\n");
    return std::make_tuple(privateKeyString, keyFile);
}

int
main() {
    auto input = std::string{};
    std::getline(std::cin, input);
    auto const  data   = juce::JSON::parse(input);
    auto const *params = data.getDynamicObject();
    if (! params) {
        std::cout << "Bad input!" << std::endl;
        return 1;
    }

    auto const commentParam = params->getProperty("comment").toString();
    auto const xmlLineParam = params->getProperty("xmlLine").toString();
    auto const privateKeyStringParam =
        params->getProperty("privateKeyString").toString();
    auto const countParam = params->getProperty("count").toString();

    auto const [privateKeyString, keyFile] =
        createKeyFile(commentParam, xmlLineParam, privateKeyStringParam);

    auto  output  = juce::var{new juce::DynamicObject{}};
    auto *context = output.getDynamicObject();
    context->setProperty("commentParam", commentParam);
    context->setProperty("xmlLineParam", xmlLineParam);
    context->setProperty("privateKeyStringParam", privateKeyStringParam);
    context->setProperty("privateKeyString", privateKeyString);
    context->setProperty("keyFile", keyFile);
    auto const outputJson = juce::JSON::toString(output).toStdString();
    if (countParam.isNotEmpty()) {
        std::cerr << "\nCount: " << countParam.toStdString() << "\n"
                  << outputJson << std::endl;
    }
    std::cout << outputJson << std::endl;
    return 0;
}
