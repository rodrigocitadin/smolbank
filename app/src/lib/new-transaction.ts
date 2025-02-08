'use server'

import { NewTransactionFormSchema, NewTransactionFormState } from "@/types"
import { axios } from "@/lib"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function newTransaction(_state: NewTransactionFormState, formData: FormData) {
  const validatedFields = NewTransactionFormSchema.safeParse({
    email: formData.get("email"),
    amount: formData.get("amount"),
  })

  console.log(validatedFields)

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  try {
    const cookiesStore = await cookies()
    const accountToken = cookiesStore.get('smolbank:account-token')?.value

    await axios.post(
      "/accounts/transactions",
      validatedFields.data,
      { headers: { Authorization: `Bearer ${accountToken}` } }
    )
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.status === 400) return { message: "Invalid transaction" }
      if (err.status === 404) return { message: "Account not found" }
      return { message: "Something went wrong, please try again later..." }
    }
    return { message: String(err) }
  }

  revalidatePath("/")
  redirect("/")
}
