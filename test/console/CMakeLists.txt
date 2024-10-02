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

# load-from-memory-block
set(TARGET_LOAD_FROM_MEMORY console_load_from_memory_block)
console_config_target(${TARGET_LOAD_FROM_MEMORY})
target_sources(${TARGET_LOAD_FROM_MEMORY} PRIVATE src/loadFromMemoryBlock.cpp)
target_link_libraries(${TARGET_LOAD_FROM_MEMORY} PRIVATE juce::juce_core)
set_target_properties(${TARGET_LOAD_FROM_MEMORY}
    PROPERTIES OUTPUT_NAME "load-from-memory-block"
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

# create-key-pair
set(TARGET_CREATE_KEY_PAIR console_create_key_pair)
console_config_target(${TARGET_CREATE_KEY_PAIR})
target_sources(${TARGET_CREATE_KEY_PAIR} PRIVATE src/createKeyPair.cpp)
target_link_libraries(${TARGET_CREATE_KEY_PAIR} PRIVATE juce::juce_cryptography)
set_target_properties(${TARGET_CREATE_KEY_PAIR}
    PROPERTIES OUTPUT_NAME "create-key-pair"
)

# apply-key-file
set(TARGET_APPLY_KEY_FILE console_apply_key_file)
console_config_target(${TARGET_APPLY_KEY_FILE})
target_sources(${TARGET_APPLY_KEY_FILE} PRIVATE src/applyKeyFile.cpp)
target_link_libraries(${TARGET_APPLY_KEY_FILE}
    PRIVATE
    juce::juce_data_structures
    juce::juce_product_unlocking
)
set_target_properties(${TARGET_APPLY_KEY_FILE}
    PROPERTIES OUTPUT_NAME "apply-key-file"
)
