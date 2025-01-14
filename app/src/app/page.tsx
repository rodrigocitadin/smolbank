import { PayDebtsIcon, SendTransactionIcon } from "@/assets";
import Image from "next/image";

type Action = {
  id: number
  icon: any
  text: string
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
      <Image src={action.icon} alt={action.text} />
      <span>{action.text}</span>
      {/* {action.text.split(" ").map(text => <span key={text}>{text}</span>)} */}
    </div>
  )
}
