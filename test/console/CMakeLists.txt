cmake_minimum_required(VERSION 3.30.3)
include(cmake/ConfigTarget.cmake)
include(cmake/CPM.cmake)
CPMAddPackage(juce
    NAME juce
    GIT_TAG 8.0.2
    GITHUB_REPOSITORY juce-framework/juce
    SYSTEM YES
    EXCLUDE_FROM_ALL YES
)
project(console VERSION 0.0.1)

# create-key-file-content-line
set(TARGET_CREATE_KEY_FILE_CONTENT_LINE
    console_create_key_file_content_line
)
console_config_target(${TARGET_CREATE_KEY_FILE_CONTENT_LINE})
target_sources(${TARGET_CREATE_KEY_FILE_CONTENT_LINE}
    PRIVATE
    src/createKeyFileContentLine.cpp
)
target_link_libraries(${TARGET_CREATE_KEY_FILE_CONTENT_LINE}
    PRIVATE
    juce::juce_product_unlocking
)
set_target_properties(${TARGET_CREATE_KEY_FILE_CONTENT_LINE}
    PROPERTIES OUTPUT_NAME "create-key-file-content-line"
)

# load-big-integer-from-utf8
set(TARGET_LOAD_BIG_INTEGER_FROM_UTF8
    console_load_big_integer_from_utf8
)
console_config_target(${TARGET_LOAD_BIG_INTEGER_FROM_UTF8})
target_sources(${TARGET_LOAD_BIG_INTEGER_FROM_UTF8}
    PRIVATE
    src/loadBigIntegerFromUTF8.cpp
)
target_link_libraries(${TARGET_LOAD_BIG_INTEGER_FROM_UTF8}
    PRIVATE
    juce::juce_core
)
set_target_properties(${TARGET_LOAD_BIG_INTEGER_FROM_UTF8}
    PROPERTIES OUTPUT_NAME "load-big-integer-from-utf8"
)