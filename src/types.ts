import { JuceBigInteger } from './JuceBigInteger'
export { JuceBigInteger }
import { z } from 'zod'

export const createKeyFileCommentParamsValidator = z.object({
    appName: z.string().min(1),
    userEmail: z.string().min(1).email(),
    userName: z.string(),
    machineNumbers: z.string().min(1)
})
export type CreateKeyFileCommentParams = z.infer<
    typeof createKeyFileCommentParamsValidator
>

export const machineNumbersAttributeNameValidator = z.enum([
    'mach',
    'expiring_mach'
])
export type MachineNumbersAttributeName = z.infer<
    typeof machineNumbersAttributeNameValidator
>

export const createKeyFileContentLineParamsValidator =
    createKeyFileCommentParamsValidator.extend({
        machineNumbersAttributeName: machineNumbersAttributeNameValidator
    })
export type CreateKeyFileContentLineParams = z.infer<
    typeof createKeyFileContentLineParamsValidator
>

export const rsaKeyComponentsValidator = z.string().refine(
    // Ports juce::RSAKey::RSAKey() and juce::RSAKey::applyToValue()
    x =>
        x.includes(',') &&
        x.split(',').every(p => !JuceBigInteger.fromHex(p).isZero())
)
export type RSAKeyComponents = z.infer<typeof rsaKeyComponentsValidator>

export const encryptableBigintValidator = z.bigint().refine(x => x > 0n)
export type EncryptableBigint = z.infer<typeof encryptableBigintValidator>

export const encryptBigintParamsValidator = z.object({
    privateKey: rsaKeyComponentsValidator,
    val: encryptableBigintValidator
})
export type EncryptBigintParams = z.infer<typeof encryptBigintParamsValidator>

export const generateKeyFileParamsValidator =
    createKeyFileCommentParamsValidator.extend({
        privateKey: rsaKeyComponentsValidator
    })
export type GenerateKeyFileParams = z.infer<
    typeof generateKeyFileParamsValidator
>

export const generateExpiringKeyFileParamsValidator =
    generateKeyFileParamsValidator.extend({
        expiryTime: z.date()
    })
export type GenerateExpiringKeyFileParams = z.infer<
    typeof generateExpiringKeyFileParamsValidator
>
