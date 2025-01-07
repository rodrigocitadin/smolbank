defmodule CumbucaChallenge.Accounts do
  alias CumbucaChallenge.Accounts.Delete
  alias CumbucaChallenge.Accounts.Update
  alias CumbucaChallenge.Accounts.GetAll
  alias CumbucaChallenge.Accounts.GetByCpf
  alias CumbucaChallenge.Accounts.Get
  alias CumbucaChallenge.Accounts.Create
  alias CumbucaChallenge.Accounts.Verify

  defdelegate create(params), to: Create, as: :call
  defdelegate get(id), to: Get, as: :call
  defdelegate get_by_cpf(cpf), to: GetByCpf, as: :call
  defdelegate get_all(), to: GetAll, as: :call
  defdelegate verify(params), to: Verify, as: :call
  defdelegate update(params), to: Update, as: :call
  defdelegate delete(id), to: Delete, as: :call
end
