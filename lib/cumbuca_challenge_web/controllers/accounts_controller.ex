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

  def show(conn, %{"id" => id}) do
    with {:ok, account} <- Accounts.get(id) do
      conn
      |> put_status(:ok)
      |> render(:show, account: account)
    end
  end

  def show_cpf(conn, %{"cpf" => cpf}) do
    with {:ok, account} <- Accounts.get_by_cpf(cpf) do
      conn
      |> put_status(:ok)
      |> render(:show, account: account)
    end
  end

  def update(conn, params) do
    with {:ok, account} <- Accounts.update(params) do
      conn
      |> put_status(:ok)
      |> render(:update, account: account)
    end
  end

  def delete(conn, %{"id" => id}) do
    with {:ok, _account} <- Accounts.delete(id) do
      conn
      |> send_resp(:no_content, "")
      |> halt()
    end
  end

  def index(conn, _params) do
    accounts = Accounts.get_all()

    conn
    |> put_status(:ok)
    |> render(:index, accounts: accounts)
  end
end
