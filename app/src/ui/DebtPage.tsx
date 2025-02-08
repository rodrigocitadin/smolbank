'use client'

import { payDebts } from "@/lib"
import { Account } from "@/types"
import { FormError, Input, InputError } from "@/ui"
import { useActionState } from "react"

export default function DebtPage({ account }: { account: Account }) {
  const [state, action, pending] = useActionState(payDebts, undefined)

  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      <Input
        required
        label="Amount"
        type="number"
        placeholder={Number(account.debt).toFixed(2)}
        max={Number(account.debt)}
        min={0}
        step={0.01}
        id="amount"
      />
      {state?.errors?.amount && <InputError errors={state.errors.amount} />}

      <FormError error={state?.message} />

      <button
        disabled={pending}
        className="bg-zinc-900 text-white mt-8 py-1 disabled:bg-zinc-600"
      >
        Pay
      </button>
    </form >
  )
}
