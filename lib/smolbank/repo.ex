defmodule Smolbank.Repo do
  use Ecto.Repo,
    otp_app: :smolbank,
    adapter: Ecto.Adapters.Postgres
end
