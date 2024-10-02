#include <juce_cryptography/juce_cryptography.h>

static auto
encryptXMLLine(
    juce::String const &xmlLineParam, juce::String const &privateKeyStringParam
) noexcept {
    // Taken from juce::KeyFileUtils::encryptXML()
    using namespace juce;
    auto const privateKey       = juce::RSAKey{privateKeyStringParam};
    auto const privateKeyString = privateKey.toString();

    MemoryOutputStream text;
    text << xmlLineParam;

    BigInteger val;
    val.loadFromMemoryBlock(text.getMemoryBlock());

    privateKey.applyToValue(val);

    auto const encryptedXMLLine = val.toString(16);

    return std::make_tuple(privateKeyString, encryptedXMLLine);
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

    auto const xmlLineParam = params->getProperty("xmlLine").toString();
    auto const privateKeyStringParam =
        params->getProperty("privateKeyString").toString();
    auto const countParam = params->getProperty("count").toString();

    auto const [privateKeyString, encryptedXMLLine] =
        encryptXMLLine(xmlLineParam, privateKeyStringParam);

    auto  output  = juce::var{new juce::DynamicObject{}};
    auto *context = output.getDynamicObject();
    context->setProperty("xmlLineParam", xmlLineParam);
    context->setProperty("privateKeyStringParam", privateKeyStringParam);
    context->setProperty("privateKeyString", privateKeyString);
    context->setProperty("encryptedXMLLine", encryptedXMLLine);
    auto const outputJson = juce::JSON::toString(output).toStdString();
    if (countParam.isNotEmpty()) {
        std::cerr << "\nCount: " << countParam.toStdString() << "\n"
                  << outputJson << std::endl;
    }
    std::cout << outputJson << std::endl;
    return 0;
}
