import { axios, verifyToken } from "@/lib"
import { Account } from "@/types"
import { DebtPage } from "@/ui"

export default async function PayDebt() {
  const { accountToken } = await verifyToken()

  const bearerHeader = { headers: { "Authorization": `Bearer ${accountToken}` } }
  const { data: accountResponse } = await axios.get<{ message: string, data: Account }>("/accounts", bearerHeader)
  const { data: account } = accountResponse

  return <DebtPage account={account} />
}
