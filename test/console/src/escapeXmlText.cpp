#include <juce_core/juce_core.h>

static auto
textElement(juce::String const &tag, juce::String const &text) noexcept
    -> juce::String {
    // The write path juce::XmlElement offers for element TEXT: addTextElement
    // makes the text child, and singleLine drops the indentation and the line
    // breaks so what comes out is the element and nothing else.
    auto element = juce::XmlElement{tag};
    element.addTextElement(text);
    return element.toString(
        juce::XmlElement::TextFormat{}.singleLine().withoutHeader()
    );
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

    auto const element = textElement(
        params->getProperty("tag"), params->getProperty("text")
    );

    auto const output = element.toStdString();
    std::cout << output << std::endl;
    return 0;
}
