import { Timestamps } from "@/types"

type Account = {
  id: string
  name: string
  balance: string
  debt: string
  email: string
} & Timestamps

export default Account
