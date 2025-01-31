import { axios, verifyToken } from "@/lib";
import { Transaction } from "@/types";
import { TransactionCard } from "@/ui";

export default async function Dashboard() {
  const { accountToken, accountId } = await verifyToken()

  const bearerHeader = { headers: { "Authorization": `Bearer ${accountToken}` } }

  const { data: transactions } = await axios.get<{ message: string, data: Transaction[] }>("/accounts/transactions", bearerHeader)


  return (
    <>
      <h2 className="text-xl mb-4">Your transactions</h2>
      {transactions.data.length
        ? (
          transactions.data.map(transaction =>
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              accountId={accountId}
            />)
        )
        : (
          <p className="text-zinc-500">You don&apos;t have any transactions yet :(</p>
        )
      }
    </>
  );
}
