export default function InputError({ errors }: { errors: string[] }) {
  return (
    <div className="flex flex-col">
      {
        errors.map(error => (
          <p className="text-red-500 text-sm" key={error}>{error}</p>
        ))
      }
    </div>
  )
}
