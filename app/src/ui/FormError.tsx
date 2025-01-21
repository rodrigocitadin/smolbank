export default function FormError({ error }: { error: boolean }) {
  return error && <p className="text-red-500">Something went wrong, please try again later...</p>
}
