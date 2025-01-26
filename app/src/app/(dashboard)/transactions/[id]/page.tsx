import { axios, verifyToken } from "@/lib";
import { type Transaction } from "@/types";

export default async function Transaction({ params }: {
  params: Promise<{ id: string }>
}) {
  const { accountToken, accountId } = await verifyToken()
  const bearerHeader = { headers: { "Authorization": `Bearer ${accountToken}` } }

  const transactionId = (await params).id;
  const { data: transactionResult } = await axios.get<{ message: string, data: Transaction }>(`/accounts/transactions/${transactionId}`, bearerHeader)
  const transaction = transactionResult.data

  return (
    <>
      <h1>{transactionId}</h1>
      <p>{JSON.stringify(transaction.sender)}</p>
      <p>{JSON.stringify(transaction.receiver)}</p>
    </>
  )
}
