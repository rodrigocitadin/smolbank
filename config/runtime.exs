import Config
import Dotenvy

if config_env() == :dev do
  source!([".env", System.get_env()])
end

secret_key_base =
  env!("SECRET_KEY_BASE") ||
    raise """
    environment variable SECRET_KEY_BASE is missing.
    You can generate one by calling: mix phx.gen.secret
    """

database_url =
  env!("POSTGRES_URL") ||
    raise """
    environment variable POSTGRES_URL is missing.
    For development, please set it in your .env file.
    For example: ecto://USER:PASS@HOST/DATABASE
    """

config :smolbank, Smolbank.Repo,
  url: database_url,
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

config :smolbank, SmolbankWeb.Endpoint, secret_key_base: secret_key_base

if config_env() == :prod do
  if System.get_env("PHX_SERVER") do
    config :smolbank, SmolbankWeb.Endpoint, server: true
  end

  maybe_ipv6 = if System.get_env("ECTO_IPV6") in ~w(true 1), do: [:inet6], else: []
  config :smolbank, Smolbank.Repo, socket_options: maybe_ipv6

  host = System.get_env("PHX_HOST") || "example.com"
  port = String.to_integer(System.get_env("PORT") || "4000")

  config :smolbank, :dns_cluster_query, System.get_env("DNS_CLUSTER_QUERY")

  config :smolbank, SmolbankWeb.Endpoint,
    url: [host: host, port: 443, scheme: "https"],
    http: [
      ip: {0, 0, 0, 0, 0, 0, 0, 0},
      port: port
    ]
end
