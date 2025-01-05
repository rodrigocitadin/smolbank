defmodule CumbucaChallenge.Accounts do
  alias CumbucaChallenge.Accounts.Create

  defdelegate create(params), to: Create, as: :call
end
