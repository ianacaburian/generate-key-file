#include <juce_core/juce_core.h>

static void
loadBigIntegerFromUTF8(
    juce::BigInteger &val, juce::String const &input
) noexcept {
    // Taken from juce::KeyFileUtils::encryptXML()
    juce::MemoryOutputStream text;
    text << input;
    val.loadFromMemoryBlock(text.getMemoryBlock());
}

int
main() {
    auto input = std::string{};
    std::getline(std::cin, input);

    auto b = juce::BigInteger{};
    loadBigIntegerFromUTF8(b, input);
    auto const hex = b.toString(16);

    auto const output = hex.toStdString();
    std::cout << output << std::endl;
    return 0;
}
