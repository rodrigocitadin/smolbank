defmodule Smolbank.Transactions.AllByAccountId do
  import Ecto.Query

  alias Smolbank.Transactions.Transaction
  alias Smolbank.Repo

  def call(id) do
    Transaction
    |> where([u], u.sender_id == ^id)
    |> or_where([u], u.receiver_id == ^id)
    |> order_by([u], desc: u.inserted_at)
    |> preload([:sender, :receiver])
    |> Repo.all()
  end
end
