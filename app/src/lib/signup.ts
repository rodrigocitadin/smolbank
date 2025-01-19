'use server'

import { SignupFormSchema, SignupFormState } from "@/types"
import { axios } from "@/lib"
import { cookies } from "next/headers"

export default async function signup(_state: SignupFormState, formData: FormData) {
  const validateFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  console.log(validateFields)

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors }
  }

  try {
    await axios.post("/accounts", validateFields.data)

    const token = await axios.post("/accounts/auth", {
      email: validateFields.data.email,
      password: validateFields.data.password
    })

    const cookieStore = await cookies()
    cookieStore.set('smolbank:account_token', token.data.bearer)
  } catch (err) {
    console.log(err)
  }
}
