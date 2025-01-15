defmodule SmolbankWeb.Token do
  alias SmolbankWeb.Endpoint
  alias Phoenix.Token

  @sign_salt "dev"

  def sign(account), do: Token.sign(Endpoint, @sign_salt, account.id)

  def verify(token), do: Token.verify(Endpoint, @sign_salt, token, :infinity)
end
