defmodule Smolbank.Accounts do
  alias Smolbank.Accounts.Delete
  alias Smolbank.Accounts.Update
  alias Smolbank.Accounts.GetAll
  alias Smolbank.Accounts.GetByCpf
  alias Smolbank.Accounts.Get
  alias Smolbank.Accounts.Create
  alias Smolbank.Accounts.Verify

  defdelegate create(params), to: Create, as: :call
  defdelegate get(id, opts \\ []), to: Get, as: :call
  defdelegate get_by_cpf(cpf), to: GetByCpf, as: :call
  defdelegate get_all(), to: GetAll, as: :call
  defdelegate verify(params), to: Verify, as: :call
  defdelegate update(params), to: Update, as: :call
  defdelegate delete(id), to: Delete, as: :call
end
