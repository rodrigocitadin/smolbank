import { DashboardIcon, PayDebtsIcon, SendTransactionIcon } from "@/assets";
import { Action } from "@/types";

const actions: Action[] = [
  {
    id: 0,
    icon: DashboardIcon,
    text: "Your transactions",
    redirect: "/"
  },
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
