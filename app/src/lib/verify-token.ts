'use server'
import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtDecode } from "jwt-decode";

async function verifyToken() {
  const cookieStore = await cookies()
  const accountToken = cookieStore.get('smolbank:account-token')?.value

  if (!accountToken) redirect('/signin')

  const accountId = jwtDecode(accountToken).sub

  if (!accountId) {
    cookieStore.delete('smolbank:account-token')
    redirect('/signin')
  }

  return { accountToken, accountId }
}

export default verifyToken
