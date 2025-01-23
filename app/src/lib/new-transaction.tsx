'use server'

import { NewTransactionFormSchema, NewTransactionFormState, Transaction } from "@/types"
import { axios } from "@/lib"
import { cookies } from "next/headers"
import { AxiosResponse } from "axios"
import { redirect } from "next/navigation"

type TransactionResponse = {
  data: Transaction
  message: string
}

export default async function newTransaction(_state: NewTransactionFormState, formData: FormData) {
  const validatedFields = NewTransactionFormSchema.safeParse({
    email: formData.get("email"),
    amount: formData.get("amount"),
  })

  console.log(validatedFields)

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  let transactionId = ""

  try {
    const cookiesStore = await cookies()
    const accountToken = cookiesStore.get('smolbank:account-token')?.value

    const { data: transaction }: AxiosResponse<TransactionResponse> = await axios.post(
      "/accounts/transactions",
      validatedFields.data,
      { headers: { Authorization: `Bearer ${accountToken}` } }
    )

    transactionId = transaction.data.id
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.status === 404) return { message: "Email not found, try another one" }
      return { message: "Something went wrong, please try again later..." }
    }
    return { message: String(err) }
  }

  redirect(`/transactions/${transactionId}`)
}
