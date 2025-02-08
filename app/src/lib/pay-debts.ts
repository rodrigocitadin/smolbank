'use server'

import { PayDebtsFormSchema, PayDebtsFormState } from "@/types"
import { axios } from "@/lib"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function payDebts(_state: PayDebtsFormState, formData: FormData) {
  const validatedFields = PayDebtsFormSchema.safeParse({ amount: formData.get("amount") })

  if (!validatedFields.success) { return { errors: validatedFields.error.flatten().fieldErrors } }

  try {
    const cookiesStore = await cookies()
    const accountToken = cookiesStore.get('smolbank:account-token')?.value

    await axios.post(
      "/accounts/debt",
      validatedFields.data,
      { headers: { Authorization: `Bearer ${accountToken}` } }
    )
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.status === 400) return { message: "Invalid payment" }
      return { message: "Something went wrong, please try again later..." }
    }
    return { message: String(err) }
  }

  revalidatePath("/")
  redirect("/")
}
