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

set(TARGET_LOAD_BIG_INTEGER_FROM_UTF8
    console_load_big_integer_from_utf8
)
console_config_target(${TARGET_LOAD_BIG_INTEGER_FROM_UTF8})
target_link_libraries(${TARGET_LOAD_BIG_INTEGER_FROM_UTF8}
    PRIVATE
    juce::juce_core
)
target_sources(${TARGET_LOAD_BIG_INTEGER_FROM_UTF8}
    PRIVATE
    src/loadBigIntegerFromUTF8.cpp
)
set_target_properties(${TARGET_LOAD_BIG_INTEGER_FROM_UTF8}
    PROPERTIES OUTPUT_NAME "load-big-integer-from-utf8"
)

set(CONSOLE_TARGET_KEY_FILE_GENERATOR
    console_generate_key_file
)