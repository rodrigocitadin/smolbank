import { logout } from "@/lib";
import { Action } from "@/types";

export default async function LogoutButton(action: Action) {
  return (
    <form action={logout}>
      <button
        className="my-4 flex flex-col items-center gap-2 bg-gradient-to-tr from-zinc-200 to-zinc-50 p-4 min-w-40"
      >
        <span>{action.text}</span>
      </button>
    </form>
  )
}
