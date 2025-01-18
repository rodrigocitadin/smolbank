import { capitalizeFirstChar } from "@/helpers";
import { axios } from "@/lib";
import { setCookie } from "@/lib/set-cookie";
import { Account } from "@/types";
import { MoneyCard } from "@/ui";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { data: { data: account } } = await axios.get<{ message: string, data: Account }>("/accounts")
  // await setCookie("account_id", account.id)

  return (
    <header>
      {/* <h1 className="text-4xl">Hi, {capitalizeFirstChar(account.name)}!</h1> */}
      {/* <h2 className="text-2xl">How are your finances today?</h2> */}
      {/* <div className="mt-8 border-t border-t-zinc-200 mb-4 pt-8"> */}
      {/*   <MoneyCard text="Balance:" amount={Number(account.balance)} /> */}
      {/*   <MoneyCard text="Debt:" amount={Number(account.debt)} negative /> */}
      {/* </div> */}
      {children}
    </header>
  )
}
