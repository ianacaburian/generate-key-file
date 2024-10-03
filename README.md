# generate-key-file (Under Development)

Ports juce_KeyGeneration::generateKeyFile() to node.

# Installation

```
npm i @ianacaburian/generate-key-file
```

# Usage

### `generateKeyFile(params: GenerateKeyFileParams, date: Date = new Date()) => string`

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

-   From juce_KeyFileGeneration.h:

```
    /**
        Generates the content of a key-file which can be sent to a user's machine to
        unlock a product.

        The returned value is a block of text containing an RSA-encoded block, followed
        by some human-readable details. If you pass this block of text to
        OnlineUnlockStatus::applyKeyFile(), it will decrypt it, and if the
        key matches and the machine numbers match, it will unlock that machine.

        Typically the way you'd use this on a server would be to build a small executable
        that simply calls this method and prints the result, so that the webserver can
        use this as a reply to the product's auto-registration mechanism. The
        keyGenerationAppMain() function is an example of how to build such a function.

        @see OnlineUnlockStatus
    */
```

-   Returns the <key> string value to be used in the XML response for decryption
    by the client.
-   Throws ZodError for invalid params -- see
    [zod](https://github.com/colinhacks/zod).

### `generateExpiringKeyFile(params: GenerateExpiringKeyFileParams, date: Date = new Date()) => string`

```
import { generateExpiringKeyFile } from '@ianacaburian/generate-key-file'

const oneDayFromNow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
const expiringKeyFileContent = generateExpiringKeyFile({
    userName: 'Ian',
    userEmail: 'ian@email.com',
    machineNumbers: '123',
    appName: 'app-name-or-product-id',
    privateKey: 'comma-sep-private-key'
    expiryTime: oneDayFromNow
})
```

-   From juce_KeyFileGeneration.h:

```
    /** Similar to the above key file generation method but with an expiry time.
        You must supply a Time after which this key file should no longer be considered as active.

        N.B. when an app is unlocked with an expiring key file, OnlineUnlockStatus::isUnlocked will
        still return false. You must then check OnlineUnlockStatus::getExpiryTime to see if this
        expiring key file is still in date and act accordingly.

        @see OnlineUnlockStatus
    */
```

-   Returns the <key> string value to be used in the XML response for decryption
    by the client.
-   Throws ZodError for invalid params -- see
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

Optional: Set "FC_NUM_RUMS" (default=1) to specify how many times to run each
(randomly generated) propery-based test -- see
[fast-check](https://github.com/dubzzz/fast-check).

```
FC_NUM_RUNS=1000 npm run test   # Run each fc test 1000 times.
```
