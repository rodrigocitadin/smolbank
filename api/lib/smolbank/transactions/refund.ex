defmodule Smolbank.Transactions.Refund do
  alias Ecto.Multi
  alias Smolbank.Repo
  alias Smolbank.Accounts
  alias Accounts.Account
  alias Smolbank.Transactions
  alias Transactions.Transaction

  def call(transaction_id, sender_id) do
    with %Transaction{} = transaction <- Transactions.get(transaction_id),
         true <- correct_owner?(transaction, sender_id),
         true <- valid_refund?(transaction),
         {:ok, %Account{} = sender} <- Accounts.get(sender_id, lock: "FOR UPDATE"),
         {:ok, %Account{} = receiver} <- Accounts.get(transaction.receiver_id) do
      Multi.new()
      |> withdraw(receiver, transaction.amount)
      |> deposit(sender, transaction.amount)
      |> update(transaction_id)
      |> Repo.transaction()
    else
      _ -> {:error, :bad_request}
    end
  end

  defp correct_owner?(%Transaction{sender_id: sender_id}, owner_id), do: sender_id === owner_id
  defp valid_refund?(%Transaction{status: status}), do: status === :finished

  defp withdraw(multi, %Account{} = account, amount) do
    updated_changeset = Account.changeset(account, %{debt: amount})
    IO.inspect(updated_changeset, label: "withdraw")

    Multi.update(multi, :withdraw, updated_changeset)
  end

  defp deposit(multi, %Account{} = account, amount) do
    new_balance = Decimal.add(account.balance, amount)
    updated_changeset = Account.changeset(account, %{balance: new_balance})
    IO.inspect(updated_changeset, label: "deposit")

    Multi.update(multi, :deposit, updated_changeset)
  end

  defp update(multi, transaction_id) do
    transaction = Transactions.get(transaction_id)
    updated_changeset = Transaction.changeset(transaction, %{status: :refunded})
    IO.inspect(updated_changeset, label: "transaction")

    Multi.update(multi, :transaction, updated_changeset)
  end
end
