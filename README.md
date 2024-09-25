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

npm run install:juce-generate-key-file

```

2. Then, start the test server to run the tests:

```

npm run test

```

```

```
