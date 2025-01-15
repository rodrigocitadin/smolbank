defmodule Smolbank.Transactions do
  alias Smolbank.Transactions.AllByAccountId
  alias Smolbank.Accounts.All
  alias Smolbank.Transactions.Refund
  alias Smolbank.Transactions.Get
  alias Smolbank.Transactions.Create

  defdelegate create(params), to: Create, as: :call
  defdelegate refund(transaction_id, sender_id), to: Refund, as: :call
  defdelegate get(id), to: Get, as: :call
  defdelegate all(), to: All, as: :call
  defdelegate all_by_account_id(id), to: AllByAccountId, as: :call
end
