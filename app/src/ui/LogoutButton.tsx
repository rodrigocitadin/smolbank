'use client'

import { logout } from "@/lib";
import { Action } from "@/types";
import { useEffect, useRef, useState } from "react";

export default function LogoutButton(action: Action) {
  const [confirmLogout, setConfirmLogout] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)

  function handleLogout() {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    confirmLogout ? logout() : setConfirmLogout(true)
  }

  useEffect(() => {
    if (confirmLogout) setTimeout(() => { setConfirmLogout(false) }, 3000)
  }, [confirmLogout])

  return (
    < button
      ref={ref}
      className={`my-4 flex flex-col items-center gap-2 bg-gradient-to-tr p-4 min-w-40 ${confirmLogout ? "from-red-700 to-red-600 text-white" : "from-zinc-200 to-zinc-50 "}`}
      onClick={handleLogout}
    >
      <span>{confirmLogout ? "Confirm" : action.text}</span>
    </button >
  )
}
