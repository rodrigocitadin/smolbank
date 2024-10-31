defmodule CumbucaChallenge.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      CumbucaChallengeWeb.Telemetry,
      CumbucaChallenge.Repo,
      {DNSCluster, query: Application.get_env(:cumbuca_challenge, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: CumbucaChallenge.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: CumbucaChallenge.Finch},
      # Start a worker by calling: CumbucaChallenge.Worker.start_link(arg)
      # {CumbucaChallenge.Worker, arg},
      # Start to serve requests, typically the last entry
      CumbucaChallengeWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: CumbucaChallenge.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    CumbucaChallengeWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
