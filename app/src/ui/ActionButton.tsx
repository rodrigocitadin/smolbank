'use client'

import Image from "next/image";
import { Action } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ActionButton(action: Action) {
  const pathname = usePathname()

  return (
    <Link
      href={action.redirect}
      className={
        `my-4 shadow-md flex flex-col items-center gap-2 bg-gradient-to-tr from-zinc-100 to-zinc-50 rounded-md p-4 min-w-40 ${pathname === action.redirect ? "!from-zinc-300 !to-zinc-200" : ""}`
      }
    >
      <Image src={action.icon} alt={action.text} width={25} height={25} />
      <span>{action.text}</span>
    </Link>
  )
}
