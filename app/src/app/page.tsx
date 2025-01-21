'use client'

import { signin } from "@/lib";
import { FormError, Input, InputError } from "@/ui";
import Link from "next/link";
import { useActionState } from "react";

export default function Home() {
  const [state, action, pending] = useActionState(signin, undefined)

  return (
    <main>
      <h1>
        Login to your account or <Link
          href="/new-account"
          className="text-blue-500 underline visited:text-purple-500"
        >
          create one
        </Link>
      </h1>

      <form className="mt-8 flex flex-col gap-4" action={action}>
        <Input required label="Email" type="email" placeholder="smol@bank.com" id="email" />
        {state?.errors?.email && <InputError errors={state.errors.email} />}

        <Input required label="Password" type="password" placeholder="*************" id="password" />
        {state?.errors?.password && <InputError errors={state.errors.password} />}

        <FormError error={state?.message} />

        <button disabled={pending} className="bg-zinc-400 text-white mt-8 py-1 disabled:bg-zinc-200">Login</button>
      </form>
    </main>
  )
}
