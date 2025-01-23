import { z } from 'zod'

export const NewTransactionFormSchema = z.object({
  email: z.string().email().trim(),
  amount: z.number({ coerce: true }).positive()
})

export type NewTransactionFormState =
  | {
    errors?: {
      email?: string[]
      amount?: string[]
    }
    message?: string
  }
  | undefined
