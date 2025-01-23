'use client'

import { newTransaction } from "@/lib"
import { Account } from "@/types"
import { FormError, Input, InputError } from "@/ui"
import { useActionState } from "react"

export default function TransactionPage({ account }: { account: Account }) {
  const [state, action, pending] = useActionState(newTransaction, undefined)

  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      <Input required label="Email" type="email" placeholder="smol@bank.com" id="email" />
      {state?.errors?.email && <InputError errors={state.errors.email} />}

      <Input required label="Amount" type="number" step="0.01" max={account.balance} placeholder="$ 0.00" id="amount" />
      {state?.errors?.amount && <InputError errors={state.errors.amount} />}

      <FormError error={state?.message} />

      <button
        disabled={pending}
        className="bg-zinc-900 text-white mt-8 py-1 disabled:bg-zinc-600"
      >
        Send
      </button>
    </form>
  )
}
