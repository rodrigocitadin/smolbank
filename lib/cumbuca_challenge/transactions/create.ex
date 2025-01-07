defmodule CumbucaChallenge.Transactions.Create do
  alias CumbucaChallenge.Transactions.Transaction
  alias CumbucaChallenge.Accounts.Account
  alias CumbucaChallenge.Accounts
  alias CumbucaChallenge.Repo
  alias Ecto.Multi

  def call(%{"sender_id" => sender_id, "receiver_id" => receiver_id, "amount" => amount} = params) do
    with {:ok, sender} <- Accounts.get(sender_id),
         {:ok, receiver} <- Accounts.get(receiver_id),
         {:ok, amount} <- Decimal.cast(amount) do
      Multi.new()
      |> withdraw(sender, amount)
      |> deposit(receiver, amount)
      |> create(params)
      |> Repo.transaction()
      |> preload_assocs()
    end
  end

  def call(_), do: {:error, :bad_request}

  defp withdraw(multi, %Account{} = account, amount) do
    new_balance = Decimal.sub(account.balance, amount)

    updated_changeset =
      Account.changeset(account, %{balance: new_balance})
      |> Ecto.Changeset.validate_number(:balance, greater_than_or_equal_to: 0)

    Multi.update(multi, :withdraw, updated_changeset)
  end

  defp deposit(multi, %Account{} = account, amount) do
    new_balance = Decimal.add(account.balance, amount)

    updated_changeset =
      Account.changeset(account, %{balance: new_balance})
      |> Ecto.Changeset.validate_number(:balance, greater_than_or_equal_to: 0)

    Multi.update(multi, :deposit, updated_changeset)
  end

  defp create(multi, params), do: Multi.insert(multi, :transaction, Transaction.changeset(params))

  defp preload_assocs({:ok, %{transaction: transaction}}) do
    result =
      transaction
      |> Repo.preload(:sender)
      |> Repo.preload(:receiver)

    {:ok, result}
  end

  defp preload_assocs({:error, _, error, _}), do: {:error, error}
end
