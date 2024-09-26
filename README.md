# generate-key-file

Provides juce_KeyGeneration::generateKeyFile() for javascript.

# Installation

```
npm i @ianacaburian/generate-key-file
```

# Usage

```
import { generateKeyFile } from '@ianacaburian/generate-key-file'

const keyFileContent = generateKeyFile({
    userName: 'Ian',
    userEmail: 'ian@email.com',
    machineNumbers: '123',
    appName: 'app-name-or-product-id',
    privateKey: 'comma-sep-private-key'
})
```

# Testing

1. To test against the juce implementation, test binaries must first be
   installed:

```
npm run install:test/console
```

2. Then, start the test server to run the tests. Set "FC_NUM_RUMS" to specify
   how many times to run each property based test (default=1000000).

```
FC_NUM_RUNS=1000000 npm run test // Runs each property based test 1 million times.
```

# Development

The following scripts are available for development:

```
npm run clean:test/console  # Clean test/console build dir.
npm run open:test/console   # Open test/console project in Xcode.
```
