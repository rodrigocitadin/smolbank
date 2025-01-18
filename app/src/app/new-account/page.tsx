import Input from "@/ui/Input";
import Link from "next/link";

export default function NewAccount() {
  return (
    <main>
      <h1 className="pb-8 border-b border-b-zinc-200">
        Create a new account or <Link
          href="/"
          className="text-blue-500 underline visited:text-purple-500"
        >
          login to an existing one
        </Link>
      </h1>
      <form className="mt-8 flex flex-col gap-4">
        <Input label="Email" type="email" placeholder="smol@bank.com" id="email" />
        <Input label="Password" type="password" placeholder="*************" id="password" />
        <Input label="Repeat password" type="password" placeholder="*************" id="repeat-password" />
        <button className="bg-zinc-400 text-white mt-8 py-1">Register</button>
      </form>
    </main>
  )
}
