defmodule SmolbankWeb.TransactionsController do
  alias Smolbank.Transactions
  use SmolbankWeb, :controller

  action_fallback SmolbankWeb.FallbackController

  def create(conn, params) do
    account_id = conn.assigns[:account_id]
    params = Map.merge(%{"sender_id" => account_id}, params)

    with {:ok, transaction} <- Transactions.create(params) do
      conn
      |> put_status(:created)
      |> render(:created, transaction: transaction)
    end
  end

  def refund(conn, %{"transaction_id" => transaction_id}) do
    account_id = conn.assigns[:account_id]

    with {:ok, transaction} <- Transactions.refund(transaction_id, account_id) do
      conn
      |> put_status(:ok)
      |> render(:refund, transaction: transaction)
    end
  end

  def one(conn, %{"id" => id}) do
    transaction = Transactions.get(id)

    conn
    |> put_status(:ok)
    |> render(:one, transaction: transaction)
  end

  def all(conn, _params) do
    transactions =
      conn.assigns[:account_id]
      |> Transactions.all_by_account_id()

    conn
    |> put_status(:ok)
    |> render(:all, transactions: transactions)
  end
end
