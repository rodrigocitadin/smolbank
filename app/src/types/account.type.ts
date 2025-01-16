import { UUID } from "crypto"
import { Timestamps } from "@/types"

type Account = {
  id: UUID
  name: string
  balance: number
  debt: number
  cpf: string
} & Timestamps

export default Account
