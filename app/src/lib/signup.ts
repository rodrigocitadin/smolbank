'use server'

import { SignupFormSchema, SignupFormState } from "@/types"

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
}
