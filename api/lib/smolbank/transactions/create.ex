defmodule Smolbank.Transactions.Create do
  alias Smolbank.Transactions.Transaction
  alias Smolbank.Accounts.Account
  alias Smolbank.Accounts
  alias Smolbank.Repo
  alias Ecto.Multi

  def call(
        %{"sender_id" => sender_id, "email" => receiver_email, "amount" => amount} =
          params
      ) do
    with {:ok, %Account{} = receiver} <- Accounts.get_by_email(receiver_email),
         true <- sender_id !== receiver.id,
         {:ok, amount} <- Decimal.cast(amount),
         {:ok, %Account{} = sender} <- Accounts.get(sender_id, lock: "FOR UPDATE") do
      params = Map.merge(%{"receiver_id" => receiver.id}, params)

      Multi.new()
      |> withdraw(sender, amount)
      |> deposit(receiver, amount)
      |> create(params)
      |> Repo.transaction()
      |> preload_assocs()
    else
      false -> {:error, :bad_request}
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

  defp create(multi, params) do
    params = Map.put(params, "status", :finished)
    Multi.insert(multi, :transaction, Transaction.changeset(%Transaction{}, params))
  end

  defp preload_assocs({:ok, %{transaction: transaction}}) do
    result =
      transaction
      |> Repo.preload(:sender)
      |> Repo.preload(:receiver)

    {:ok, result}
  end

  defp preload_assocs({:error, _, error, _}), do: {:error, error}
end
