defmodule Smolbank.Transactions.All do
  alias Smolbank.Transactions.Transaction
  alias Smolbank.Repo

  def call(), do: Repo.all(Transaction)
end
