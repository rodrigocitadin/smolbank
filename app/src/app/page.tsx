import { PayDebtsIcon, SendTransactionIcon } from "@/assets";
import Image from "next/image";

type Action = {
  id: number
  icon: any
  text: string
}

type Transaction = {
  username: string
  amount: number
  date: Date
  kind: 'Sent' | 'Received' | 'Refunded'
}

export default function Home() {
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

  const date = new Date

  return (
    <>
      <div className="mx-4 my-8">
        <h1 className="text-4xl">Hi, Rodrigo!</h1>
        <h2 className="text-2xl">How are your finances today?</h2>
      </div>
      <main className="mx-4">
        <section>
          <MoneyCard text="Balance:" amount={100} />
          <MoneyCard text="Debt:" amount={50} negative />
        </section>
        <section className="flex flex-col gap-2 my-8">
          {actions.map(action => <ActionButton key={action.id} action={action} />)}
        </section>
        <section>
          {/* <div className="sticky top-0 bg-zinc-900"> */}
          {/*   <input /> */}
          {/* </div> */}
          <TransactionCard
            username="Marquito"
            amount={100}
            date={date}
            kind="Sent"
          />
          <TransactionCard
            username="Luizinho"
            amount={10}
            date={date}
            kind="Received"
          />
          <TransactionCard
            username="Rodolfo"
            amount={500}
            date={date}
            kind="Refunded"
          />
          <TransactionCard
            username="Marquito"
            amount={100}
            date={date}
            kind="Sent"
          />
          <TransactionCard
            username="Luizinho"
            amount={10}
            date={date}
            kind="Received"
          />
          <TransactionCard
            username="Rodolfo"
            amount={500}
            date={date}
            kind="Refunded"
          />
          <button className="block mx-auto my-4">
            Load more
          </button>
        </section>
      </main>
    </>
  );
}

function MoneyCard({ text, amount, negative }: { text: string, amount: number, negative?: boolean }) {
  return (
    <div className="flex justify-between text-xl">
      <p>{text}</p>
      <strong className={negative ? "text-red-500" : ""}>{amount.toFixed(2)} $</strong>
    </div>
  )
}

function ActionButton({ action }: { action: Action }) {
  return (
    <div className="flex items-center gap-2">
      <Image src={action.icon} alt={action.text} width={25} height={25} />
      <span>{action.text}</span>
    </div>
  )
}

function TransactionCard(transaction: Transaction) {
  return (
    <div className="my-4 p-4 flex flex-col bg-gradient-to-tr from-zinc-100 to-zinc-50 rounded-md shadow-md">
      <div className="flex justify-between text-sm text-zinc-500">
        <small>{transaction.kind}</small>
        <small>{transaction.date.toISOString()}</small>
      </div>
      <span className="text-zinc-700">{transaction.username}</span>
      <strong className="text-xl">{transaction.amount.toFixed(2)} $</strong>
    </div>
  )
}
