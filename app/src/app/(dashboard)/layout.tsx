import { ActionButton, LogoutButton, MoneyCard } from "@/ui";
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
        <div className="pt-4 my-8 border-y border-y-zinc-200 flex flex-col">
          <div>
            <MoneyCard text="Balance:" amount={account.data.balance} />
            <MoneyCard text="Debt:" amount={account.data.debt} negative />
          </div>
          <div className="flex -mx-4 gap-4 px-4 overflow-x-scroll">
            {actions.map(action => action.text === "Logout"
              ? <LogoutButton key={action.id} {...action} />
              : <ActionButton key={action.id} {...action} />
            )}
          </div>
        </div>
      </header>
      <main>
        {children}
      </main>
    </>
  );
}
