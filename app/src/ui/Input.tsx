import { InputProps } from "@/types/props";

export default function Input(props: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xl" htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        className="border-zinc-200 border px-2 py-1 focus:ring-transparent focus:!outline-zinc-400 focus:outline"
        type={props.type ?? "text"}
        placeholder={props.placeholder ?? "placeholder"}
      />
    </div>
  )
}
