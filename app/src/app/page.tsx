import { PayDebtsIcon, SendTransactionIcon } from "@/assets";
import { axios, verifyToken } from "@/lib";
import { Account, Action, Transaction } from "@/types";
import { ActionButton, MoneyCard, TransactionCard } from "@/ui";

type RequestRespose = {

}

export default async function Dashboard() {
  const { accountToken, accountId } = await verifyToken()

  const bearerHeader = { headers: { "Authorization": `Bearer ${accountToken}` } }

  const accountRequest = axios.get<{ message: string, data: Account }>("/accounts", bearerHeader)
  const transactionsRequest = axios.get<{ message: string, data: Transaction[] }>("/accounts/transactions", bearerHeader)

  const [
    { data: account },
    { data: transactions }
  ] = await Promise.all([accountRequest, transactionsRequest])

  const actions: Action[] = [
    {
      id: 1,
      icon: SendTransactionIcon,
      text: "New transaction"
    },
    {
      id: 2,
      icon: PayDebtsIcon,
      text: "Pay debts"
    },
  ]

  return (
    <>
      <header>
        <h1 className="text-4xl">Hi, {account.data.name}</h1>
        <h2 className="text-2xl">How are your finances today?</h2>
        <div className="py-4 my-8 border-y border-y-zinc-200 flex flex-col gap-4">
          <div>
            <MoneyCard text="Balance:" amount={account.data.balance} />
            <MoneyCard text="Debt:" amount={account.data.debt} negative />
          </div>
          <div className="flex gap-4">
            {actions.map(action => <ActionButton key={action.id} {...action} />)}
          </div>
        </div>
      </header>
      <main>
        <h2 className="text-xl mb-4">Your transactions</h2>
        {transactions.data.length
          ? (
            <>
              {transactions.data.map(transaction =>
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  accountId={accountId}
                />
              )}
              <button className="block mx-auto">
                Load more
              </button>
            </>
          )
          : (
            <p className="text-zinc-500">You don't have any transactions yet :(</p>
          )
        }
      </main>
    </>
  );
}
