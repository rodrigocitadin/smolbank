import { PayDebtsIcon, SendTransactionIcon } from "@/assets";
import { format } from "date-fns";
import Image from "next/image";
import { axios } from "@/app/lib";
import { UUID } from "crypto";

type Action = {
  id: number
  icon: any
  text: string
}

type TransactionStatus =
  | 'pending'
  | 'finished'
  | 'cancelled'
  | 'refunded'

type Timestamps = {
  updated_at: Date
  inserted_at: Date
}

type Transaction = {
  id: UUID
  amount: string
  sender: Account,
  receiver: Account
  status: TransactionStatus
} & Timestamps

type Account = {
  id: UUID
  name: string
  balance: number
  debt: number
  cpf: string
} & Timestamps

export default async function Home() {
  let { data: { data: account } } =
    await axios.get<{ message: string, data: Account }>("/accounts")

  let { data: { data: transactions } } =
    await axios.get<{ message: string, data: Transaction[] }>("/accounts/transactions")

  console.log(account)
  console.log(transactions)

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
      <header className="my-8">
        <h1 className="text-4xl">Hi, {capitalizeFirstChar(account.name)}!</h1>
        <h2 className="text-2xl">How are your finances today?</h2>
      </header>
      <main>
        <section className="py-8 border-y border-y-zinc-200">
          <div>
            <MoneyCard text="Balance:" amount={Number(account.balance)} />
            <MoneyCard text="Debt:" amount={Number(account.debt)} negative />
          </div>
          <div className="flex gap-2 mt-4">
            {actions.map(action => <ActionButton key={action.id} {...action} />)}
          </div>
        </section>
        <section className="my-8">
          <h2 className="text-xl mb-4">Your transactions</h2>
          {transactions
            ? (
              <>
                {transactions.map(transaction =>
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    account={account}
                  />
                )}
                <button className="block mx-auto">
                  Load more
                </button>
              </>
            )
            : (
              <p className="text-zinc-500">You haven't any transactions yet :(</p>
            )
          }
        </section>
      </main>
    </>
  );
}

function MoneyCard({ text, amount, negative }: { text: string, amount: number, negative?: boolean }) {
  return (
    <div className="flex justify-between text-xl">
      <p>{text}</p>
      <strong className={negative && amount > 0 ? "text-red-500" : ""}>{amount.toFixed(2)} $</strong>
    </div>
  )
}

function ActionButton(action: Action) {
  return (
    <button className="flex flex-col items-center gap-2 bg-gradient-to-tr from-zinc-100 to-zinc-50 rounded-md shadow-md p-4">
      <Image src={action.icon} alt={action.text} width={25} height={25} />
      <span>{action.text}</span>
    </button>
  )
}

function TransactionCard({ transaction, account }: { transaction: Transaction, account: Account }) {
  const isSender = transaction.sender.id === account.id
  const kind = isSender && transaction.status === 'finished' ? 'Sent' : 'Received'

  return (
    <div className="my-4 p-4 flex flex-col bg-gradient-to-tr from-zinc-100 to-zinc-50 rounded-md shadow-md">
      <div className="flex justify-between text-sm text-zinc-500">
        <small>
          {transaction.status === 'finished' ? kind : capitalizeFirstChar(transaction.status)
          }
        </small>
        <small>{format(transaction.updated_at, "dd MMM, yyyy 'at' hh:mm a")}</small>
      </div>
      <span className="text-zinc-700">
        {capitalizeFirstChar(isSender ? transaction.receiver.name : transaction.sender.name)}
      </span>
      <strong className="text-xl">{Number(transaction.amount).toFixed(2)} $</strong>
    </div>
  )
}

function capitalizeFirstChar(value: string) {
  return value.length >= 2
    ? value[0].toUpperCase() + value.slice(1)
    : value.toUpperCase()
}
