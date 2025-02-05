import { capitalizeFirstChar } from "@/helpers";
import { axios, verifyToken } from "@/lib";
import { type Transaction } from "@/types";
import { TransactionCard } from "@/ui";
import { format } from "date-fns";

export default async function Transaction({ params }: {
  params: Promise<{ id: string }>
}) {
  const { accountToken } = await verifyToken()
  const bearerHeader = { headers: { "Authorization": `Bearer ${accountToken}` } }

  const transactionId = (await params).id;
  const { data: transactionResult } = await axios.get<{ message: string, data: Transaction }>(`/accounts/transactions/${transactionId}`, bearerHeader)
  const transaction = transactionResult.data

  return (
    <>
      <h2 className="text-sm text-zinc-500 mb-4">
        Transaction sent by <strong>{capitalizeFirstChar(transaction.sender.name)}</strong> at {format(transaction.inserted_at, "dd MMM, yyyy 'at' hh:mm a")}
      </h2>
      <TransactionCard transaction={transaction} accountId={transaction.sender.id} />
    </>
  )
}
