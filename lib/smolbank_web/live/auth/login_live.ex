defmodule SmolbankWeb.Auth.LoginLive do
  use SmolbankWeb, :live_view_auth

  def mount(_params, _session, socket) do
    {:ok, socket, temporary_assigns: [form: nil]}
  end
end
