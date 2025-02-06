import { Action } from "@/types";

const actions: Action[] = [
  {
    id: 0,
    text: "Your transactions",
    redirect: "/",
  },
  {
    id: 1,
    text: "New transaction",
    redirect: "/transactions",
  },
  {
    id: 2,
    text: "Pay debts",
    redirect: "/transactions/debt",
  },
  {
    id: 3,
    text: "Logout",
    redirect: "",
  }
]

export default actions
