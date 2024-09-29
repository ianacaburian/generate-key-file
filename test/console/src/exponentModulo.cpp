#include <juce_core/juce_core.h>

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

    auto const dividendHexParam = params->getProperty("dividendHex").toString();
    auto const divisorHexParam = params->getProperty("divisorHex").toString();
    
    auto dividend = juce::BigInteger{};
    auto divisor = juce::BigInteger{};
    auto remainder = juce::BigInteger{};
    
    dividend.parseString(dividendHexParam, 16);
    divisor.parseString(divisorHexParam, 16);
    
    auto const dividendHex = dividend.toString(16);
    auto const divisorHex = divisor.toString(16);
    
    dividend.divideBy(divisor, remainder);
    auto const quotientHex = dividend.toString(16);
    auto const remainderHex = remainder.toString(16);

    auto output = juce::var{new juce::DynamicObject{}};
    auto *context = output.getDynamicObject();
    context->setProperty("dividendHexParam", dividendHexParam);
    context->setProperty("divisorHexParam", divisorHexParam);
    context->setProperty("dividendHex", dividendHex);
    context->setProperty("divisorHex", divisorHex);
    context->setProperty("quotientHex", quotientHex);
    context->setProperty("remainderHex", remainderHex);
    std::cout << juce::JSON::toString(output).toStdString() << std::endl;
    return 0;
}
