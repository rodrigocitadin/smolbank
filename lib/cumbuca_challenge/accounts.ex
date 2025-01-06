defmodule CumbucaChallenge.Accounts do
  alias CumbucaChallenge.Accounts.GetByCpf
  alias CumbucaChallenge.Accounts.Get
  alias CumbucaChallenge.Accounts.Create

  defdelegate create(params), to: Create, as: :call
  defdelegate get(id), to: Get, as: :call
  defdelegate get_by_cpf(cpf), to: GetByCpf, as: :call
end
