import { axios, verifyToken } from "@/lib";
import { Account } from "@/types";
import { TransactionPage } from "@/ui";

export default async function Transactions() {
  const { accountToken } = await verifyToken()

  const bearerHeader = { headers: { "Authorization": `Bearer ${accountToken}` } }
  const { data: accountResponse } = await axios.get<{ message: string, data: Account }>("/accounts", bearerHeader)
  const { data: account } = accountResponse

  return <TransactionPage account={account} />
}
