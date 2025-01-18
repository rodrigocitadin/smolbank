import { Account, TransactionStatus, Timestamps } from "@/types"

type Transaction = {
  id: string
  amount: string
  sender: Account,
  receiver: Account
  status: TransactionStatus
} & Timestamps

export default Transaction
