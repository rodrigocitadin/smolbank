defmodule CumbucaChallengeWeb.FallbackController do
  use CumbucaChallengeWeb, :controller

  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> put_view(json: CumbucaChallengeWeb.ErrorJSON)
    |> render(:error, errors: :not_found)
  end

  def call(conn, {:error, changeset}) do
    conn
    |> put_status(:bad_request)
    |> put_view(json: CumbucaChallengeWeb.ErrorJSON)
    |> render(:error, changeset: changeset)
  end
end
