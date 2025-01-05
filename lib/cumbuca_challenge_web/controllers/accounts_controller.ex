defmodule CumbucaChallengeWeb.AccountsController do
  use CumbucaChallengeWeb, :controller

  alias CumbucaChallenge.Accounts
  alias Accounts.Account

  action_fallback CumbucaChallengeWeb.FallbackController

  def create(conn, params) do
    with {:ok, %Account{} = account} <- Accounts.create(params) do
      conn
      |> put_status(:created)
      |> render(:create, account: account)
    end
  end
end
