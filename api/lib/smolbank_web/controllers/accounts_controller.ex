defmodule SmolbankWeb.AccountsController do
  use SmolbankWeb, :controller

  alias SmolbankWeb.Token
  alias Smolbank.Accounts
  alias Accounts.Account

  action_fallback SmolbankWeb.FallbackController

  def create(conn, params) do
    with {:ok, %Account{} = account} <- Accounts.create(params) do
      conn
      |> put_status(:created)
      |> render(:create, account: account)
    end
  end

  def auth(conn, params) do
    with {:ok, %Account{} = account} <- Accounts.verify(params),
         {:ok, token, _claims} <- Token.sign(account) do
      conn
      |> put_status(:ok)
      |> render(:auth, token: token)
    end
  end

  def update(conn, params) do
    account_id = conn.assigns[:account_id]
    params = Map.merge(%{"id" => account_id}, params)

    with {:ok, account} <- Accounts.update(params) do
      conn
      |> put_status(:ok)
      |> render(:update, account: account)
    end
  end

  def pay_debt(conn, %{"amount" => _amount} = params) do
    account_id = conn.assigns[:account_id]
    params = Map.merge(%{"id" => account_id}, params)

    with {:ok, _account} <- Accounts.pay_debt(params) do
      conn
      |> send_resp(:no_content, "")
      |> halt()
    end
  end

  def delete(conn, _params) do
    account_id = conn.assigns[:account_id]

    with {:ok, _account} <- Accounts.delete(account_id) do
      conn
      |> send_resp(:no_content, "")
      |> halt()
    end
  end

  def index(conn, _params) do
    account_id = conn.assigns[:account_id]

    with {:ok, account} <- Accounts.get(account_id) do
      conn
      |> put_status(:ok)
      |> render(:index, account: account)
    end
  end

  def all(conn, _params) do
    accounts = Accounts.all()

    conn
    |> put_status(:ok)
    |> render(:all, accounts: accounts)
  end
end
