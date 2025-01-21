'use server'

import { SignupFormSchema, SignupFormState } from "@/types"
import { axios } from "@/lib"
import { redirect } from "next/navigation"

export default async function signup(_state: SignupFormState, formData: FormData) {
  const validateFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors }
  }

  try {
    await axios.post("/accounts", validateFields.data)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.data.errors) return { errors: err.response.data.errors }
      return { message: "Something went wrong, please try again later..." }
    }
    return { message: String(err) }
  }

  redirect('/')
}
