'use server'

import { axios } from "@/lib"
import { revalidatePath } from "next/cache"
// import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function refund(transactionId: string) {
  try {
    const cookiesStore = await cookies()
    const authToken = cookiesStore.get('smolbank:account-token')?.value

    await axios.post(`/accounts/transactions/refund/${transactionId}`, null, { headers: { Authorization: `Bearer ${authToken}` } })
  } catch (err) {
    console.log(err)
  }

  revalidatePath('/')
}
