import { z } from 'zod'

export const PayDebtsFormSchema = z.object({
  amount: z.number({ coerce: true }).positive()
})

export type PayDebtsFormState =
  | {
    errors?: {
      amount?: string[]
    }
    message?: string
  }
  | undefined
