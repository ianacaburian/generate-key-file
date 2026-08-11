import { z } from 'zod'

import { JuceBigInteger } from './juce/JuceBigInteger'

export const createKeyFileCommentParamsSchema = z.object({
    appName: z.string().min(1),
    userEmail: z.string().min(1),
    userName: z.string().min(1),
    machineNumbers: z.string().min(1)
})
export type CreateKeyFileCommentParams = z.infer<
    typeof createKeyFileCommentParamsSchema
>

export const machineNumbersAttributeNameSchema = z.enum([
    'mach',
    'expiring_mach'
])
export type MachineNumbersAttributeName = z.infer<
    typeof machineNumbersAttributeNameSchema
>

export const createKeyFileContentLineParamsSchema =
    createKeyFileCommentParamsSchema.extend({
        machineNumbersAttributeName: machineNumbersAttributeNameSchema
    })
export type CreateKeyFileContentLineParams = z.infer<
    typeof createKeyFileContentLineParamsSchema
>

export const rsaKeyComponentsSchema = z.stringFormat(
    // Ports juce::RSAKey::RSAKey() and juce::RSAKey::applyToValue()
    'RSAKeyComponents',
    x =>
        x.includes(',') &&
        x.split(',').every(p => !JuceBigInteger.fromHex(p).isZero())
)
export type RSAKeyComponents = z.infer<typeof rsaKeyComponentsSchema>

export const generateKeyFileParamsSchema =
    createKeyFileCommentParamsSchema.extend({
        privateKey: rsaKeyComponentsSchema
    })
export type GenerateKeyFileParams = z.infer<typeof generateKeyFileParamsSchema>

export const generateExpiringKeyFileParamsSchema =
    generateKeyFileParamsSchema.extend({
        expiryTime: z.date().min(new Date('1970-01-01T00:00:00.001Z'), {
            error: 'Expiry time must be after 1970-01-01T00:00:00.000Z'
        })
    })
export type GenerateExpiringKeyFileParams = z.infer<
    typeof generateExpiringKeyFileParamsSchema
>

export const generateCustomKeyFileParamsSchema = z.object({
    rootTag: z.string().min(1),
    attributes: z.record(z.string().min(1), z.string().min(1)),
    comment: z.string().min(1),
    privateKey: rsaKeyComponentsSchema
})
export type GenerateCustomKeyFileParams = z.infer<
    typeof generateCustomKeyFileParamsSchema
>

export const decryptBytesParamsSchema = z.object({
    hexValue: z.string().regex(/^[0-9a-fA-F]+$/),
    key: rsaKeyComponentsSchema
})
export type DecryptBytesParams = z.infer<typeof decryptBytesParamsSchema>
