import { Timestamps } from "@/types"

type Account = {
  id: string
  name: string
  balance: number
  debt: number
  cpf: string
} & Timestamps

export default Account
