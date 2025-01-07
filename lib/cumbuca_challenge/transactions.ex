defmodule CumbucaChallenge.Transactions do
  alias CumbucaChallenge.Transactions.Create

  defdelegate create(params), to: Create, as: :call
end
