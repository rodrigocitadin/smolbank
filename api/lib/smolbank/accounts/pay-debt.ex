defmodule Smolbank.Accounts.PayDebt do
  import Ecto.Query

  alias Smolbank.Accounts
  alias Accounts.Account
  alias Smolbank.Repo

  def call(%{"id" => id, "amount" => amount}) do
    Repo.transaction(fn ->
      account =
        Repo.one!(
          from a in Account,
            where: a.id == ^id,
            lock: "FOR UPDATE"
        )

      verify_amount(amount, account.balance, account.debt) && Repo.rollback(:invalid_balance)

      {:ok, account} =
        Account.changeset(
          account,
          %{
            balance: Decimal.sub(account.balance, amount),
            debt: Decimal.sub(account.debt, amount)
          }
        )
        |> Repo.update()

      account
    end)
  end

  defp verify_amount(amount, balance, debt),
    do: balance >= amount && amount <= debt && 0 >= amount
end
