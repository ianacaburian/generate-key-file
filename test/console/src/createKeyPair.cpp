#include <juce_cryptography/juce_cryptography.h>

static auto
createKeyPair() noexcept {
    auto publicKey  = juce::RSAKey{};
    auto privateKey = juce::RSAKey{};
    juce::RSAKey::createKeyPair(publicKey, privateKey, 256);

    return std::make_tuple(publicKey.toString(), privateKey.toString());
}

int
main() {
    auto const [publicKey, privateKey] = createKeyPair();

    auto  output  = juce::var{new juce::DynamicObject{}};
    auto *context = output.getDynamicObject();
    context->setProperty("publicKey", publicKey);
    context->setProperty("privateKey", privateKey);
    std::cout << juce::JSON::toString(output).toStdString() << std::endl;
    return 0;
}
