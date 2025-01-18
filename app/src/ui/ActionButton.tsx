import Image from "next/image";
import { Action } from "@/types";

export default function ActionButton(action: Action) {
  return (
    <button className="flex flex-col items-center gap-2 bg-gradient-to-tr from-zinc-100 to-zinc-50 rounded-md shadow-md p-4">
      <Image src={action.icon} alt={action.text} width={25} height={25} />
      <span>{action.text}</span>
    </button>
  )
}
