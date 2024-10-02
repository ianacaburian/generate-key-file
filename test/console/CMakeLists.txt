cmake_minimum_required(VERSION 3.30.3)
include(cmake/ConfigTarget.cmake)
include(cmake/CPM.cmake)
CPMAddPackage(juce
    NAME juce
    GIT_TAG develop
    GITHUB_REPOSITORY juce-framework/juce
    SYSTEM YES
    EXCLUDE_FROM_ALL YES
)
project(console VERSION 0.0.1)

# create-key-file-content-line
set(TARGET_CREATE_KEY console_create_key_file_content_line)
console_config_target(${TARGET_CREATE_KEY})
target_sources(${TARGET_CREATE_KEY} PRIVATE src/createKeyFileContentLine.cpp)
target_link_libraries(${TARGET_CREATE_KEY} PRIVATE juce::juce_core)
set_target_properties(${TARGET_CREATE_KEY}
    PROPERTIES OUTPUT_NAME "create-key-file-content-line"
)

# load-big-integer-from-utf8
set(TARGET_LOAD_BIG_INT console_load_big_integer_from_utf8)
console_config_target(${TARGET_LOAD_BIG_INT})
target_sources(${TARGET_LOAD_BIG_INT} PRIVATE src/loadBigIntegerFromUTF8.cpp)
target_link_libraries(${TARGET_LOAD_BIG_INT} PRIVATE juce::juce_core)
set_target_properties(${TARGET_LOAD_BIG_INT}
    PROPERTIES OUTPUT_NAME "load-big-integer-from-utf8"
)

# divide-by
set(TARGET_DIVIDE_BY console_divide_by)
console_config_target(${TARGET_DIVIDE_BY})
target_sources(${TARGET_DIVIDE_BY} PRIVATE src/divideBy.cpp)
target_link_libraries(${TARGET_DIVIDE_BY} PRIVATE juce::juce_core)
set_target_properties(${TARGET_DIVIDE_BY}
    PROPERTIES OUTPUT_NAME "divide-by"
)

# exponent-modulo
set(TARGET_EXPONENT_MODULO console_exponent_modulo)
console_config_target(${TARGET_EXPONENT_MODULO})
target_sources(${TARGET_EXPONENT_MODULO} PRIVATE src/exponentModulo.cpp)
target_link_libraries(${TARGET_EXPONENT_MODULO} PRIVATE juce::juce_core)
set_target_properties(${TARGET_EXPONENT_MODULO}
    PROPERTIES OUTPUT_NAME "exponent-modulo"
)

# apply-to-value
set(TARGET_APPLY_TO_VALUE console_apply_to_value)
console_config_target(${TARGET_APPLY_TO_VALUE})
target_sources(${TARGET_APPLY_TO_VALUE} PRIVATE src/applyToValue.cpp)
target_link_libraries(${TARGET_APPLY_TO_VALUE} PRIVATE juce::juce_cryptography)
set_target_properties(${TARGET_APPLY_TO_VALUE}
    PROPERTIES OUTPUT_NAME "apply-to-value"
)
