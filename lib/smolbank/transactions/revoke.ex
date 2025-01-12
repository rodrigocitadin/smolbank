defmodule Smolbank.Transactions.Revoke do
  alias Smolbank.Transactions
  alias Transactions.Transaction

  def call(transaction_id, owner_id) do
    with {:ok, transaction} <- Transactions.get(transaction_id),
         true <- correct_owner?(transaction, owner_id) do
      raise("Not implemented yet")
    end
  end

  def correct_owner?(%Transaction{sender_id: sender_id}, owner_id), do: sender_id === owner_id
end
