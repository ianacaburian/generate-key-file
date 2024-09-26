#! /bin/bash

set -e
cmake --preset xcode-macos-dev "$@"
cmake --open build/xcode-macos-dev