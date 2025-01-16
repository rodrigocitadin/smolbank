import { UUID } from "crypto"
import { Account, TransactionStatus, Timestamps } from "@/types"

type Transaction = {
  id: UUID
  amount: string
  sender: Account,
  receiver: Account
  status: TransactionStatus
} & Timestamps

export default Transaction
