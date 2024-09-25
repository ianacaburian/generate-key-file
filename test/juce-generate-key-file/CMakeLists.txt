cmake_minimum_required(VERSION 3.22)
include(cmake/CPM.cmake)
CPMAddPackage(juce
    NAME juce
    GIT_TAG 8.0.1
    GITHUB_REPOSITORY juce-framework/juce
    SYSTEM YES
    EXCLUDE_FROM_ALL YES
)
project(juce_generate_key_file VERSION 0.0.1)
juce_add_console_app(${PROJECT_NAME}
    PRODUCT_NAME ${PROJECT_NAME}
)
target_compile_features(${PROJECT_NAME}
    PRIVATE
    cxx_std_20
)
target_compile_definitions(${PROJECT_NAME}
    PUBLIC
    JUCE_WEB_BROWSER=0
    JUCE_USE_CURL=0
)
target_link_libraries(${PROJECT_NAME}
    PRIVATE
    juce::juce_product_unlocking
    PUBLIC
    juce::juce_recommended_config_flags
    juce::juce_recommended_lto_flags
    juce::juce_recommended_warning_flags
)
target_include_directories(${PROJECT_NAME}
    PRIVATE
    ${PROJECT_SOURCE_DIR}
)
target_sources(${PROJECT_NAME}
    PRIVATE
    main.cpp
)
set(CUSTOM_INSTALL_DIR "${PROJECT_SOURCE_DIR}/../bin")
set_target_properties(${PROJECT_NAME}
    PROPERTIES OUTPUT_NAME "juce-generate-key-file"
)
install(TARGETS ${PROJECT_NAME}
    RUNTIME DESTINATION "${CUSTOM_INSTALL_DIR}"
    LIBRARY DESTINATION "${CUSTOM_INSTALL_DIR}"
    ARCHIVE DESTINATION "${CUSTOM_INSTALL_DIR}"
)
