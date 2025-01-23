import { InputProps } from "@/types/props";

export default function Input(props: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xl" htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        name={props.id}
        type={props.type ?? "text"}
        placeholder={props.placeholder ?? "placeholder"}
        className="border-zinc-200 border px-2 py-1 focus:border-zinc-400"
        {...props}
      />
    </div>
  )
}
