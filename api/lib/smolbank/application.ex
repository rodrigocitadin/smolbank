defmodule Smolbank.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    unless Mix.env() == :prod do
      Dotenv.load()
      Mix.Task.run("loadconfig")
    end

    children = [
      SmolbankWeb.Telemetry,
      Smolbank.Repo,
      {DNSCluster, query: Application.get_env(:smolbank, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Smolbank.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Smolbank.Finch},
      # Start a worker by calling: Smolbank.Worker.start_link(arg)
      # {Smolbank.Worker, arg},
      # Start to serve requests, typically the last entry
      SmolbankWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Smolbank.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    SmolbankWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
