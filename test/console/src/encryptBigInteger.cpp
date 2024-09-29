#include <juce_cryptography/juce_cryptography.h>

static auto
encryptBigInteger(
    juce::RSAKey const &privateKey, juce::BigInteger &val
) noexcept -> juce::String {
    // Taken from juce::KeyFileUtils::encryptXML()
    privateKey.applyToValue(val);

    return val.toString(16);
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

    auto const privateKeyParam = params->getProperty("privateKey").toString();
    auto const valParam        = params->getProperty("val").toString();

    auto const privateKey = juce::RSAKey{privateKeyParam};
    auto       val        = juce::BigInteger{};
    val.parseString(valParam, 16);
    auto const encrypted = encryptBigInteger(privateKey, val);

    auto const output = encrypted.toStdString();
    std::cout << output << std::endl;
    return 0;
}
