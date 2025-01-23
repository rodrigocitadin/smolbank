import { PayDebtsIcon, SendTransactionIcon } from "@/assets";
import { Action } from "@/types";

const actions: Action[] = [
  {
    id: 1,
    icon: SendTransactionIcon,
    text: "New transaction",
    redirect: "/transactions"
  },
  {
    id: 2,
    icon: PayDebtsIcon,
    text: "Pay debts",
    redirect: "/transactions/debt"
  },
]

export default actions
