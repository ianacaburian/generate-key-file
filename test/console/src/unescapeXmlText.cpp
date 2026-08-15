#include <juce_core/juce_core.h>

static auto
subText(juce::String const &element) noexcept -> juce::String {
    // The read path: juce decodes entities inside its parser, so the parser is
    // the only oracle for the inverse. getAllSubText returns what the element's
    // text children decoded to.
    auto const xml = juce::parseXML(element);
    return xml == nullptr ? juce::String{"Bad input!"} : xml->getAllSubText();
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

    auto const text = subText(params->getProperty("element"));

    // As JSON: the decoded text can hold newlines, tabs and control
    // characters, none of which survive a raw line on stdout intact.
    auto const output = juce::JSON::toString(juce::var{text}).toStdString();
    std::cout << output << std::endl;
    return 0;
}
