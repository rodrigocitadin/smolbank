defmodule SmolbankWeb.Router do
  use SmolbankWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :auth do
    plug SmolbankWeb.Auth
  end

  scope "/api", SmolbankWeb do
    pipe_through :api

    post "/accounts", AccountsController, :create
    post "/accounts/auth", AccountsController, :auth
    get "/accounts/all", AccountsController, :all

    scope "/accounts" do
      pipe_through :auth

      get "/", AccountsController, :index
      patch "/", AccountsController, :update
      put "/", AccountsController, :update
      delete "/", AccountsController, :delete

      post "/transactions", TransactionsController, :create
    end
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:smolbank, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: SmolbankWeb.Telemetry
    end
  end
end
