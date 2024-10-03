macro(console_config_target TARGET_NAME)
    juce_add_console_app(${TARGET_NAME}
        PRODUCT_NAME ${TARGET_NAME}
    )
    target_compile_features(${TARGET_NAME}
        PRIVATE
        cxx_std_20
    )
    target_compile_definitions(${TARGET_NAME}
        PUBLIC
        JUCE_WEB_BROWSER=0
        JUCE_USE_CURL=0
    )
    target_link_libraries(${TARGET_NAME}
        PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags
    )
    target_include_directories(${TARGET_NAME}
        PRIVATE
        ${PROJECT_SOURCE_DIR}
    )
    set(console_INSTALL_DIR "${PROJECT_SOURCE_DIR}/../bin")
    install(TARGETS ${TARGET_NAME}
        RUNTIME DESTINATION "${console_INSTALL_DIR}"
        LIBRARY DESTINATION "${console_INSTALL_DIR}"
        ARCHIVE DESTINATION "${console_INSTALL_DIR}"
    )
endmacro()