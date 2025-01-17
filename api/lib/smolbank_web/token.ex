defmodule SmolbankWeb.Token do
  alias Smolbank.Guardian

  def sign(account), do: Guardian.encode_and_sign(account)

  def verify(token), do: Guardian.decode_and_verify(token)
end
