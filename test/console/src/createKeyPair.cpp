#include <juce_cryptography/juce_cryptography.h>

static auto
createKeyPair(int const numBits) noexcept {
    auto publicKey  = juce::RSAKey{};
    auto privateKey = juce::RSAKey{};
    juce::RSAKey::createKeyPair(publicKey, privateKey, numBits);

    return std::make_tuple(publicKey.toString(), privateKey.toString());
}

int
main(int argc, char *argv[]) {
    auto const numBits =
        argc > 1 ? juce::String{argv[1]}.getIntValue() : 256;
    auto const [publicKey, privateKey] = createKeyPair(numBits);

    auto  output  = juce::var{new juce::DynamicObject{}};
    auto *context = output.getDynamicObject();
    context->setProperty("publicKey", publicKey);
    context->setProperty("privateKey", privateKey);
    std::cout << juce::JSON::toString(output).toStdString() << std::endl;
    return 0;
}
