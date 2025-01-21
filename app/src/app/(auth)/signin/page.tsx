'use client'

import { signin } from "@/lib"
import { FormError, Input, InputError } from "@/ui"
import { useActionState } from "react"

export default function Signin() {
  const [state, action, pending] = useActionState(signin, undefined)

  return (
    <form className="mt-8 flex flex-col gap-4" action={action}>
      <Input required label="Email" type="email" placeholder="smol@bank.com" id="email" />
      {state?.errors?.email && <InputError errors={state.errors.email} />}

      <Input required label="Password" type="password" placeholder="*************" id="password" />
      {state?.errors?.password && <InputError errors={state.errors.password} />}

      <FormError error={state?.message} />

      <button disabled={pending} className="bg-zinc-900 text-white mt-8 py-1 disabled:bg-zinc-200">Login</button>
    </form>
  )
}
