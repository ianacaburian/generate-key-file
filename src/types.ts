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

export const createKeyFileContentLineParamsValidator =
    createKeyFileCommentParamsValidator.extend({
        machineNumbersAttributeName: z.enum(['mach', 'expiring_mach'])
    })
export type CreateKeyFileContentLineParams = z.infer<
    typeof createKeyFileContentLineParamsValidator
>

export const generateKeyFileParamsValidator =
    createKeyFileCommentParamsValidator.extend({
        privateKey: z.string().min(1)
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
