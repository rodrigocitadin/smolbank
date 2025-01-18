import { Timestamps } from "@/types"

type Account = {
  id: string
  name: string
  balance: number
  debt: number
  email: string
} & Timestamps

export default Account
