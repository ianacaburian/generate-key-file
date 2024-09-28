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
    auto const privateKey      = juce::RSAKey{privateKeyParam};

    auto const valParam = params->getProperty("val").toString();
    auto       val      = juce::BigInteger{};
    val.parseString(valParam, 16);
    auto const valString = val.toString(16);

    juce::BigInteger valCopy = val;
    juce::BigInteger part1;
    juce::BigInteger part2;
    part1.parseString(
        privateKeyParam.upToFirstOccurrenceOf(",", false, false), 16
    );
    part2.parseString(
        privateKeyParam.fromFirstOccurrenceOf(",", false, false), 16
    );
    juce::BigInteger remainder;
    valCopy.divideBy(part2, remainder);
    auto const rem = remainder.toString(16);
    auto const div = valCopy.toString(16);
    remainder.exponentModulo(part1, part2);
    auto const modPow = remainder.toString(16);
    

    auto const encrypted = encryptBigInteger(privateKey, val);

    std::cout << "input:" << input << std::endl;
    std::cout << "privateKeyParam: " << privateKeyParam.toStdString()
              << std::endl;
    std::cout << "valParam: " << valParam.toStdString() << std::endl;
    std::cout << "valString: " << valString.toStdString() << std::endl;
    
    std::cout << "rem: " << rem.toStdString() << std::endl;
    std::cout << "div: " << div.toStdString() << std::endl;
    std::cout << "modPow: " << modPow.toStdString() << std::endl;

    auto const output = encrypted.toStdString();
    std::cout << output << std::endl;
    return 0;
}
