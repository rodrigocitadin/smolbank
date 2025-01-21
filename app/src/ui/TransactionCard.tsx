import { capitalizeFirstChar } from "@/helpers"
import { Transaction } from "@/types"
import { format } from "date-fns"

export default function TransactionCard({ transaction, accountId }: { transaction: Transaction, accountId: string }) {
  const isSender = transaction.sender.id === accountId
  const kind = isSender && transaction.status === 'finished' ? 'Sent' : 'Received'

  return (
    <div className="my-4 p-4 flex flex-col bg-gradient-to-tr from-zinc-100 to-zinc-50 rounded-md shadow-md">
      <div className="flex justify-between text-sm text-zinc-500">
        <small>
          {transaction.status === 'finished' ? kind : capitalizeFirstChar(transaction.status)}
        </small>
        <small>{format(transaction.updated_at, "dd MMM, yyyy 'at' hh:mm a")}</small>
      </div>
      <span className="text-zinc-700">
        {capitalizeFirstChar(isSender ? transaction.receiver.name : transaction.sender.name)}
      </span>
      <strong className="text-xl">$ {Number(transaction.amount).toFixed(2)}</strong>
    </div>
  )
}
