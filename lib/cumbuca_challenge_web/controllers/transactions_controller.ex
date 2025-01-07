defmodule CumbucaChallengeWeb.TransactionsController do
  alias CumbucaChallenge.Transactions
  use CumbucaChallengeWeb, :controller

  action_fallback CumbucaChallengeWeb.FallbackController

  def create(conn, params) do
    account_id = conn.assigns[:account_id]
    params = Map.merge(%{"sender_id" => account_id}, params)

    with {:ok, transaction} <- Transactions.create(params) do
      conn
      |> put_status(:created)
      |> render(:created, transaction: transaction)
    end
  end
end
