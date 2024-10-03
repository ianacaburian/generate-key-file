#include <juce_core/juce_core.h>

static auto
exponentModulo(
    juce::String const &baseHexParam, juce::String const &exponentHexParam,
    juce::String const &modulusHexParam
) noexcept {
    auto base     = juce::BigInteger{};
    auto exponent = juce::BigInteger{};
    auto modulus  = juce::BigInteger{};

    base.parseString(baseHexParam, 16);
    exponent.parseString(exponentHexParam, 16);
    modulus.parseString(modulusHexParam, 16);

    auto const baseHex     = base.toString(16);
    auto const exponentHex = exponent.toString(16);
    auto const modulusHex  = modulus.toString(16);

    base.exponentModulo(exponent, modulus);

    auto const exponentModuloHex = base.toString(16);

    return std::make_tuple(baseHex, exponentHex, modulusHex, exponentModuloHex);
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

    auto const baseHexParam     = params->getProperty("baseHex").toString();
    auto const exponentHexParam = params->getProperty("exponentHex").toString();
    auto const modulusHexParam  = params->getProperty("modulusHex").toString();
    auto const countParam       = params->getProperty("count").toString();

    auto const [baseHex, exponentHex, modulusHex, exponentModuloHex] =
        exponentModulo(baseHexParam, exponentHexParam, modulusHexParam);

    auto  output  = juce::var{new juce::DynamicObject{}};
    auto *context = output.getDynamicObject();
    context->setProperty("baseHexParam", baseHexParam);
    context->setProperty("exponentHexParam", exponentHexParam);
    context->setProperty("modulusHexParam", modulusHexParam);
    context->setProperty("baseHex", baseHex);
    context->setProperty("exponentHex", exponentHex);
    context->setProperty("modulusHex", modulusHex);
    context->setProperty("exponentModuloHex", exponentModuloHex);
    auto const outputJson = juce::JSON::toString(output).toStdString();
    if (countParam.isNotEmpty()) {
        std::cerr << "\nCount: " << countParam.toStdString() << "\n"
                  << outputJson << std::endl;
    }
    std::cout << outputJson << std::endl;
    return 0;
}
