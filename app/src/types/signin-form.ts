import { z } from 'zod'

export const SigninFormSchema = z.object({
  email: z.string()
    .email().trim(),
  password: z.string()
    .min(8)
    .regex(/[a-zA-Z]/)
    .regex(/[0-9]/)
    .regex(/[^a-zA-Z0-9]/)
    .trim()
})

export type SigninFormState =
  | {
    errors?: {
      email?: string[]
      password?: string[]
    }
    message?: string
  }
  | undefined
