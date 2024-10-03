#include <juce_core/juce_core.h>

static void
loadFromMemoryBlock(
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

    auto val = juce::BigInteger{};
    loadFromMemoryBlock(val, input);
    auto const hex = val.toString(16);

    auto const output = hex.toStdString();
    std::cout << output << std::endl;
    return 0;
}
