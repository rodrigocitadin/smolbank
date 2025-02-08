defmodule Smolbank.Accounts do
  alias Smolbank.Accounts.PayDebt
  alias Smolbank.Accounts.All
  alias Smolbank.Accounts.Delete
  alias Smolbank.Accounts.Update
  alias Smolbank.Accounts.GetByEmail
  alias Smolbank.Accounts.Get
  alias Smolbank.Accounts.Create
  alias Smolbank.Accounts.Verify

  defdelegate create(params), to: Create, as: :call
  defdelegate get(id, opts \\ []), to: Get, as: :call
  defdelegate get_by_email(email), to: GetByEmail, as: :call
  defdelegate all(), to: All, as: :call
  defdelegate verify(params), to: Verify, as: :call
  defdelegate update(params), to: Update, as: :call
  defdelegate delete(id), to: Delete, as: :call
  defdelegate pay_debt(params), to: PayDebt, as: :call
end
