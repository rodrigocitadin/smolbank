defmodule Smolbank.Transactions do
  alias Smolbank.Transactions.Create

  defdelegate create(params), to: Create, as: :call
end
