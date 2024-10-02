#include <juce_cryptography/juce_cryptography.h>

static auto
applyToValue(
    juce::String const &privateKeyStringParam, juce::String const &valHexParam
) noexcept {
    // Taken from juce::RSAKey::RSAKey() and juce::RSAKey::applyToValue()
    auto const privateKey = juce::RSAKey{privateKeyStringParam};
    auto       val        = juce::BigInteger{};
    val.parseString(valHexParam, 16);

    auto const privateKeyString = privateKey.toString();
    auto const valHex           = val.toString(16);

    privateKey.applyToValue(val);

    auto const appliedValHex = val.toString(16);

    return std::make_tuple(privateKeyString, valHex, appliedValHex);
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

    auto const privateKeyStringParam =
        params->getProperty("privateKeyString").toString();
    auto const valHexParam = params->getProperty("valHex").toString();
    auto const countParam  = params->getProperty("count").toString();

    auto const [privateKeyString, valHex, appliedValHex] =
        applyToValue(privateKeyStringParam, valHexParam);

    auto  output  = juce::var{new juce::DynamicObject{}};
    auto *context = output.getDynamicObject();
    context->setProperty("privateKeyStringParam", privateKeyStringParam);
    context->setProperty("valHexParam", valHexParam);
    context->setProperty("privateKeyString", privateKeyString);
    context->setProperty("valHex", valHex);
    context->setProperty("appliedValHex", appliedValHex);
    auto const outputJson = juce::JSON::toString(output).toStdString();
    if (countParam.isNotEmpty()) {
        std::cerr << "\nCount: " << countParam.toStdString() << "\n"
                  << outputJson << std::endl;
    }
    std::cout << outputJson << std::endl;
    return 0;
}
