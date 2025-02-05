'use client'

import { capitalizeFirstChar } from "@/helpers"
import refund from "@/lib/refund"
import { Transaction } from "@/types"
import { format } from "date-fns"

export default function TransactionCard({ transaction, accountId }: { transaction: Transaction, accountId: string }) {
  const isSender = transaction.sender.id === accountId
  const kind = isSender && transaction.status === 'finished' ? 'Sent' : 'Received'

  function handleRefund() { refund(transaction.id) }

  return (
    <div className="my-4 p-4 flex flex-col bg-gradient-to-tr from-zinc-200 to-zinc-50">
      <div className="flex justify-between text-sm text-zinc-500">
        <small>
          {transaction.status === 'finished' ? kind : capitalizeFirstChar(transaction.status)}
        </small>
        <small>{format(transaction.updated_at, "dd MMM, yyyy 'at' hh:mm a")}</small>
      </div>
      <span className="text-zinc-700">
        {capitalizeFirstChar(isSender ? transaction.receiver.name : transaction.sender.name)}
      </span>
      <small className="text-zinc-500 text-sm mb-2">
        {isSender ? transaction.receiver.email : transaction.sender.email}
      </small>
      <div className="flex justify-between">
        <strong className="text-xl">$ {Number(transaction.amount).toFixed(2)}</strong>
        {
          isSender && transaction.status === "finished" ? (
            <button
              className="bg-gradient-to-tr from-zinc-900 to-zinc-800 px-4 text-zinc-200"
              onClick={handleRefund}
            >
              Refund
            </button>
          ) : null
        }
      </div>
    </div>
  )
}
