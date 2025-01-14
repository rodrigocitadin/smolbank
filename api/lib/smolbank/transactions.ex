defmodule Smolbank.Transactions do
  alias Smolbank.Transactions.Refund
  alias Smolbank.Transactions.Get
  alias Smolbank.Transactions.Create

  defdelegate create(params), to: Create, as: :call
  defdelegate refund(transaction_id, sender_id), to: Refund, as: :call
  defdelegate get(id), to: Get, as: :call
end
