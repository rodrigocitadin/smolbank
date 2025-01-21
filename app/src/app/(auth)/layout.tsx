'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()

  return (
    <>
      <header>
        <h1 className="text-3xl">Smolbank</h1>
        <h2 className="pb-8 border-b border-b-zinc-200">
          {
            pathname.startsWith("/signin")
              ? (
                <>
                  Sign in with your credentials or <Link
                    href="/signup"
                    className="text-blue-500 underline visited:text-purple-500"
                  >
                    sign up to a new account
                  </Link>
                </>
              )
              : (
                <>
                  Sign up with your credentials or <Link
                    href="/signin"
                    className="text-blue-500 underline visited:text-purple-500"
                  >
                    sign in to an existing account
                  </Link>
                </>
              )
          }
        </h2>
      </header>
      <main>
        {children}
      </main>
    </>
  )
}
