'use server'

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function logout() {
  const cookiesStore = await cookies()
  cookiesStore.delete('smolbank:account-token')

  redirect('/signin')
}
