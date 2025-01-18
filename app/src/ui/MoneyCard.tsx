export default function MoneyCard({ text, amount, negative }: { text: string, amount: number, negative?: boolean }) {
  return (
    <div className="flex justify-between text-xl">
      <p>{text}</p>
      <strong className={negative && amount > 0 ? "text-red-500" : ""}>{amount.toFixed(2)} $</strong>
    </div>
  )
}
