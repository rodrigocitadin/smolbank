'use server'

import { SigninFormSchema, SigninFormState } from "@/types"

export default async function signup(_state: SigninFormState, formData: FormData) {
  const validateFields = SigninFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  console.log(validateFields)

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors }
  }
}
