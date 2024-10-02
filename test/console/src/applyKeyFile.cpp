#include <juce_data_structures/juce_data_structures.h>
#include <juce_product_unlocking/juce_product_unlocking.h>

class MockOnlineUnlockStatus : public juce::OnlineUnlockStatus {
public:
    juce::RSAKey publicKey_{};

    MockOnlineUnlockStatus(juce::RSAKey publicKey)
        : publicKey_{std::move(publicKey)} {
    }
    juce::String getProductID() override {
        return "testProductId";
    }
    bool doesProductIDMatch(juce::String const &returnedIDFromServer) override {
        return returnedIDFromServer == getProductID();
    }
    juce::RSAKey getPublicKey() override {
        return publicKey_;
    }
    void saveState(juce::String const &) override {
    }
    juce::String getState() override {
        return {};
    }
    juce::String getWebsiteName() override {
        return {};
    }
    juce::URL getServerAuthenticationURL() override {
        return {};
    }
    juce::String readReplyFromWebserver(juce::String const &, juce::String const &)
        override {
        return {};
    }
    juce::StringArray getLocalMachineIDs() override {
        return {"testMachineId"};
    }
};

static auto
applyKeyFile(
    juce::String const &keyFileContentParam, juce::String const &publicKeyParam
) noexcept {
    auto unlockStatus = MockOnlineUnlockStatus{juce::RSAKey{publicKeyParam}};
    auto const publicKeyString = unlockStatus.publicKey_.toString();

    auto const applyResult = unlockStatus.applyKeyFile(keyFileContentParam);

    auto const unlockMessage =
        applyResult.wasOk() ? "OK" : applyResult.getErrorMessage();
    auto const unlockEmail = unlockStatus.getUserEmail();

    return std::make_tuple(publicKeyString, unlockMessage, unlockEmail);
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

    auto const keyFileContentParam =
        params->getProperty("keyFileContent").toString();
    auto const publicKeyParam = params->getProperty("publicKey").toString();
    auto const countParam     = params->getProperty("count").toString();

    auto const [publicKeyString, unlockMessage, unlockEmail] =
        applyKeyFile(keyFileContentParam, publicKeyParam);

    auto  output  = juce::var{new juce::DynamicObject{}};
    auto *context = output.getDynamicObject();
    context->setProperty("keyFileContentParam", keyFileContentParam);
    context->setProperty("publicKeyParam", publicKeyParam);
    context->setProperty("publicKeyString", publicKeyString);
    context->setProperty("unlockMessage", unlockMessage);
    context->setProperty("unlockEmail", unlockEmail);
    auto const outputJson = juce::JSON::toString(output).toStdString();
    if (countParam.isNotEmpty()) {
        std::cerr << "\nCount: " << countParam.toStdString() << "\n"
                  << outputJson << std::endl;
    }
    std::cout << outputJson << std::endl;
    return 0;
}
