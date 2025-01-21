export default function MoneyCard({ text, amount, negative }: { text: string, amount: string, negative?: boolean }) {
  const parsedAmount = Number(amount)

  return (
    <div className="flex justify-between text-xl">
      <p>{text}</p>
      <strong className={negative && parsedAmount > 0 ? "text-red-500" : ""}>$ {parsedAmount.toFixed(2)}</strong>
    </div>
  )
}
