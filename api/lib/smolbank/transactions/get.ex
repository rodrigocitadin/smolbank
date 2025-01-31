defmodule Smolbank.Transactions.Get do
  alias Smolbank.Transactions.Transaction
  alias Smolbank.Repo

  def call(id, opts \\ []) do
    case Repo.get(Transaction, id, opts) do
      %Transaction{} = transaction -> preload_assocs({:ok, %{transaction: transaction}})
      _ -> {:error, :not_found}
    end
  end

  defp preload_assocs({:ok, %{transaction: transaction}}),
    do: Repo.preload(transaction, [:sender, :receiver])
end
