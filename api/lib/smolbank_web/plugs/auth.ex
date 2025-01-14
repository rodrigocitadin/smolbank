defmodule SmolbankWeb.Auth do
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _opts) do
    with ["Bearer " <> token] <- get_req_header(conn, "authorization"),
         {:ok, data} <- SmolbankWeb.Token.verify(token) do
      assign(conn, :account_id, data)
    else
      _error ->
        conn
        |> SmolbankWeb.FallbackController.call({:error, :unauthorized})
        |> halt()
    end
  end
end
