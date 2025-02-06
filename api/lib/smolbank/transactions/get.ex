defmodule Smolbank.Transactions.Get do
  alias Smolbank.Transactions.Transaction
  alias Smolbank.Repo

  def call(id, opts \\ []) do
    case Repo.get(Transaction, id, opts) do
      %Transaction{} = transaction -> Repo.preload(transaction, [:sender, :receiver])
      _ -> {:error, :not_found}
    end
  end
end
