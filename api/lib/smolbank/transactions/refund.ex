defmodule Smolbank.Transactions.Refund do
  alias Ecto.Multi
  alias Smolbank.Repo
  alias Smolbank.Accounts
  alias Accounts.Account
  alias Smolbank.Transactions
  alias Transactions.Transaction

  def call(transaction_id, sender_id) do
    with {:ok, %Transaction{} = transaction} <- Transactions.get(transaction_id),
         true <- correct_owner?(transaction, sender_id),
         true <- valid_refund?(transaction),
         {:ok, %Account{} = sender} <- Accounts.get(sender_id, lock: "FOR UPDATE"),
         {:ok, %Account{} = receiver} <- Accounts.get(transaction.receiver_id) do
      Multi.new()
      |> withdraw(receiver, transaction.amount)
      |> deposit(sender, transaction.amount)
      |> update(transaction_id)
      |> Repo.transaction()
      |> preload_assocs()
    else
      false -> {:error, :bad_request}
    end
  end

  defp correct_owner?(%Transaction{sender_id: sender_id}, owner_id), do: sender_id === owner_id
  defp valid_refund?(%Transaction{status: status}), do: status !== :refunded

  defp withdraw(multi, %Account{} = account, amount) do
    updated_changeset = Account.changeset(account, %{debt: amount})

    Multi.update(multi, :withdraw, updated_changeset)
  end

  defp deposit(multi, %Account{} = account, amount) do
    new_balance = Decimal.add(account.balance, amount)
    updated_changeset = Account.changeset(account, %{balance: new_balance})

    Multi.update(multi, :deposit, updated_changeset)
  end

  defp update(multi, transaction_id) do
    transaction = Repo.get(Transaction, transaction_id)
    Multi.update(multi, :transaction, Transaction.changeset(transaction, %{status: :refunded}))
  end

  defp preload_assocs({:ok, %{transaction: transaction}}) do
    result = Repo.preload(transaction, [:sender, :receiver])

    {:ok, result}
  end

  defp preload_assocs({:error, _, error, _}), do: {:error, error}
end
