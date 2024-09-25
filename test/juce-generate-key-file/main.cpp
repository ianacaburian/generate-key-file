#include <juce_product_unlocking/juce_product_unlocking.h>
#include <iostream>
#include <string>

int main(int argc, char* argv[])
{
    using namespace juce;
//    if (argc < 2) {
//        std::cerr << "Please provide a string argument." << std::endl;
//        return 1;
//    }
//    std::string input = argv[1];

    XmlElement xml ("key");

    xml.setAttribute ("user", "testUser");
    xml.setAttribute ("email", "testEmail");

    MemoryOutputStream text;
    text << xml.toString (XmlElement::TextFormat().singleLine());
    // text.toString().toStdString() ==> `<?xml version="1.0" encoding="UTF-8"?> <key user="testUser" email="testEmail"/>`

    BigInteger val;
    val.loadFromMemoryBlock (text.getMemoryBlock());

    std::string result = val.toString(16).toStdString();
    std::cout << result << std::endl;
    return 0;
}
