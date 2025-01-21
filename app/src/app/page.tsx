import { PayDebtsIcon, SendTransactionIcon } from "@/assets";
import { axios } from "@/lib";
import { Action, Transaction } from "@/types";
import { ActionButton, MoneyCard, TransactionCard } from "@/ui";
import { cookies } from "next/headers";

export default async function Dashboard() {
  // const accountId = (await cookies()).get('account_id')?.value
  // if (!accountId) return null

  // let { data: { data: transactions } } =
  //   await axios.get<{ message: string, data: Transaction[] }>("/accounts/transactions")
  
  const transactions = null

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
    <main>
      <div className="flex gap-2 border-b border-b-zinc-200 pb-8">
        {actions.map(action => <ActionButton key={action.id} {...action} />)}
      </div>
      <section className="my-8">
        <h2 className="text-xl mb-4">Your transactions</h2>
        {transactions
          ? (
            <>
              {/* {transactions.map(transaction => */}
              {/*   <TransactionCard */}
              {/*     key={transaction.id} */}
              {/*     transaction={transaction} */}
              {/*     accountId={accountId} */}
              {/*   /> */}
              {/* )} */}
              <button className="block mx-auto">
                Load more
              </button>
            </>
          )
          : (
            <p className="text-zinc-500">You don't have any transactions yet :(</p>
          )
        }
      </section>
    </main>
  );
}
