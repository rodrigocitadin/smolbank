import { ActionButton, MoneyCard } from "@/ui";
import actions from "@/lib/actions";
import axios from "axios";
import { verifyToken } from "@/lib";
import { Account } from "@/types";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { accountToken } = await verifyToken()

  const bearerHeader = { headers: { "Authorization": `Bearer ${accountToken}` } }
  const { data: account } = await axios.get<{ message: string, data: Account }>("/accounts", bearerHeader)

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
        {children}
      </main>
    </>
  );
}
