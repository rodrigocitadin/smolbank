export default function FormError({ error }: { error?: string }) {
  return error && <p className="text-red-500">{error || "Something went wrong, please try again later..."}</p>
}
