defmodule Smolbank.Repo do
  use Ecto.Repo,
    otp_app: :smolbank,
    adapter: Ecto.Adapters.Postgres

  def init(_, opts) do
    {:ok, Keyword.put(opts, :url, System.get_env("DATABASE_URL"))}
  end
end
