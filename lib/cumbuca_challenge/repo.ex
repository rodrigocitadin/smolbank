defmodule CumbucaChallenge.Repo do
  use Ecto.Repo,
    otp_app: :cumbuca_challenge,
    adapter: Ecto.Adapters.Postgres
end
