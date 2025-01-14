defmodule SmolbankWeb.FallbackController do
  use SmolbankWeb, :controller

  def call(conn, {:error, :deadlock_detected}) do
    conn
    |> put_status(:conflict)
    |> put_view(json: SmolbankWeb.ErrorJSON)
    |> render(:error, errors: :deadlock)
  end

  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> put_view(json: SmolbankWeb.ErrorJSON)
    |> render(:error, errors: :not_found)
  end

  def call(conn, {:error, :unauthorized}) do
    conn
    |> put_status(:unauthorized)
    |> put_view(json: SmolbankWeb.ErrorJSON)
    |> render(:error, errors: :unauthorized)
  end

  def call(conn, {:error, :bad_request}) do
    conn
    |> put_status(:bad_request)
    |> put_view(json: SmolbankWeb.ErrorJSON)
    |> render(:error, errors: :bad_request)
  end

  def call(conn, {:error, changeset}) do
    conn
    |> put_status(:bad_request)
    |> put_view(json: SmolbankWeb.ErrorJSON)
    |> render(:error, errors: changeset)
  end
end
