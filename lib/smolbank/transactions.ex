defmodule Smolbank.Transactions do
  alias Smolbank.Transactions.Get
  alias Smolbank.Transactions.Create

  defdelegate create(params), to: Create, as: :call
  defdelegate get(id), to: Get, as: :call
end
