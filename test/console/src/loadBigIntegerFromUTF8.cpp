#include <juce_core/juce_core.h>

static void
loadBigIntegerFromUTF8(
    juce::BigInteger &val, juce::String const &input
) noexcept {
    // Taken from juce::KeyFileUtils::encryptXML() (juce_OnlineUnlockStatus.cpp)
    using namespace juce;
    MemoryOutputStream text;
    text << input;
    val.loadFromMemoryBlock(text.getMemoryBlock());
}

int
main(int argc, char *argv[]) {
    if (argc < 2) {
        std::cerr << "Please provide a string argument." << std::endl;
        return 1;
    }
    auto const input = argv[1];

    auto b = juce::BigInteger{};
    loadBigIntegerFromUTF8(b, input);
    auto const hex = b.toString(16);

    auto const output = hex.toStdString();
    std::cout << output << std::endl;
    return 0;
}
