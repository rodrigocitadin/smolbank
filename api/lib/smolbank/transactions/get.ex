defmodule Smolbank.Transactions.Get do
  alias Smolbank.Transactions.Transaction
  alias Smolbank.Repo

  def call(id, opts \\ []) do
    case Repo.get(Transaction, id, opts) do
      %Transaction{} = transaction -> {:ok, transaction}
      _ -> {:error, :not_found}
    end
  end
end
