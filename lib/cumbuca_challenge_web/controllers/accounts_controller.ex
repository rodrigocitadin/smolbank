defmodule CumbucaChallengeWeb.AccountsController do
  use CumbucaChallengeWeb, :controller

  alias CumbucaChallengeWeb.Token
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

  def auth(conn, params) do
    with {:ok, %Account{} = account} <- Accounts.verify(params) do
      token = Token.sign(account)

      conn
      |> put_status(:ok)
      |> render(:auth, token: token)
    end
  end
end
