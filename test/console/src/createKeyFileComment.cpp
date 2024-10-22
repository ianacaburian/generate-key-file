#include <juce_core/juce_core.h>

static auto
createKeyFileComment(
    juce::String const &appName, juce::String const &userEmail,
    juce::String const &userName, juce::String const &machineNumbers,
    juce::String const &created
) noexcept {
    // Taken from juce::KeyFileUtils::createKeyFileComment()
    using namespace juce;
    String comment;
    comment << "Keyfile for " << appName << newLine;

    if (userName.isNotEmpty())
        comment << "User: " << userName << newLine;

    comment << "Email: " << userEmail << newLine
            << "Machine numbers: " << machineNumbers << newLine
            << "Created: " << created;

    return comment;
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

    auto const content = createKeyFileComment(
        params->getProperty("appName"), params->getProperty("userEmail"),
        params->getProperty("userName"), params->getProperty("machineNumbers"),
        params->getProperty("created")
    );

    auto const output = content.toStdString();
    std::cout << output << std::endl;
    return 0;
}
