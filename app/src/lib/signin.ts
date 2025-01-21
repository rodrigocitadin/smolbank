'use server'

import { SigninFormSchema, SigninFormState } from "@/types"
import { axios } from "@/lib"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function signin(_state: SigninFormState, formData: FormData) {
  const validateFields = SigninFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  console.log(validateFields)

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors }
  }

  try {
    const response = await axios.post("/accounts/auth", validateFields.data)
    const cookiesStore = await cookies()

    cookiesStore.set('smolbank:account-token', response.data.bearer)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.status === 400) return { message: "Invalid login, probably wrong credentials" }
      if (err.status === 404) return { message: "Email not found, try creating an account" }

      return { message: "Something went wrong, please try again later..." }
    }
    return { message: String(err) }
  }

  redirect('/dashboard')
}
