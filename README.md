# generate-key-file (Under Development)

Ports juce_KeyGeneration::generateKeyFile() to node.

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

### `generateKeyFile(params: GenerateKeyFileParams) => string`

-   Returns the <key> string value to be used in the XML response
    for decryption by the client.
-   Throws:
    -   ZodError for invalid params -- see
        [zod](https://github.com/colinhacks/zod).

# Development

```
npm run clean                   # Clean dist and test builds (inc test bins).
npm run lint                    # Lint the src dir.
npm run build                   # Lint, install tests, and build package.
```

## Testing

```
npm run test                    # Start vitest to run all tests.
npm run test -- -t "divideBy"   # Start vitest to run one test.
npm run clean:test              # Clean test build.
npm run open:test/console       # Open test/console project in Xcode.
npm run install:test/console    # Build and install the test/console bins.
```

Optional: Set "FC_NUM_RUMS" (default=100) to specify how many times to run each
(randomly generated) propery-based test -- see
[fast-check](https://github.com/dubzzz/fast-check).

```
FC_NUM_RUNS=1000 npm run test   # Run each fc test 1000 times.
```
