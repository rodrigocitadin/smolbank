import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <h1>
        Login to your account or <Link
          href="/new-account"
          className="text-blue-500 underline visited:text-purple-500"
        >
          create one
        </Link>
      </h1>
    </main>
  )
}
