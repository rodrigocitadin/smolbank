'use client'

import { Action } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

export default function ActionButton(action: Action) {
  const pathname = usePathname()
  const ref = useRef<HTMLAnchorElement>(null)

  return (
    <Link
      ref={ref}
      href={action.redirect}
      className={`my-4 flex flex-col items-center gap-2 bg-gradient-to-tr from-zinc-200 to-zinc-50 p-4 min-w-40 ${pathname === action.redirect ? "!from-zinc-950 !to-zinc-800 *:text-zinc-50" : ""}`}
      onClick={() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
    >
      <span>{action.text}</span>
    </Link>
  )
}
