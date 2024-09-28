#include <juce_product_unlocking/juce_product_unlocking.h>

static auto
createKeyFileContent(
    juce::String const &appName, juce::String const &userEmail,
    juce::String const &userName, juce::String const &machineNumbers,
    juce::String const &machineNumbersAttributeName, juce::String const &date
) noexcept -> juce::XmlElement {
    // Taken from juce::KeyFileUtils::createKeyFileContent()
    using namespace juce;
    XmlElement xml("key");

    xml.setAttribute("user", userName);
    xml.setAttribute("email", userEmail);
    xml.setAttribute(machineNumbersAttributeName, machineNumbers);
    xml.setAttribute("app", appName);
    xml.setAttribute("date", date);

    return xml;
}

static auto
singleLineFromXML(juce::XmlElement const &xml) noexcept -> juce::String {
    // Taken from juce::KeyFileUtils::encryptXML()
    return xml.toString(juce::XmlElement::TextFormat().singleLine());
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
    auto const content = createKeyFileContent(
        params->getProperty("appName"), params->getProperty("userEmail"),
        params->getProperty("userName"), params->getProperty("machineNumbers"),
        params->getProperty("machineNumbersAttributeName"),
        params->getProperty("date")
    );
    auto const line = singleLineFromXML(content);

    auto const output = line.toStdString();
    std::cout << output << std::endl;
    return 0;
}
