# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

if config_env() in [:dev, :test] do
  import_config ".env.exs"
end

config :smolbank, Smolbank.Repo,
  database: "smolbank",
  username: "smolbank",
  password: "smolbank",
  hostname: "localhost",
  timout: 10_000,
  ownership_timeout: 15_000

config :smolbank,
  ecto_repos: [Smolbank.Repo],
  generators: [timestamp_type: :utc_datetime, binary_id: true]

config :smolbank, Smolbank.Guardian,
  issuer: "smolbank",
  secret_key: System.get_env("GUARDIAN_SECRET")

# Configures the endpoint
config :smolbank, SmolbankWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [json: SmolbankWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: Smolbank.PubSub,
  live_view: [signing_salt: "o3myXDaX"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :smolbank, Smolbank.Mailer, adapter: Swoosh.Adapters.Local

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.

import_config "#{config_env()}.exs"
