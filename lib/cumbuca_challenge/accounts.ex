defmodule CumbucaChallenge.Accounts do
  alias CumbucaChallenge.Accounts.Get
  alias CumbucaChallenge.Accounts.Create

  defdelegate create(params), to: Create, as: :call
  defdelegate get(id), to: Get, as: :call
end
