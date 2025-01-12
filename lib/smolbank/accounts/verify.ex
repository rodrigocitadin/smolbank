defmodule Smolbank.Accounts.Verify do
  alias Smolbank.Accounts

  def call(%{"cpf" => cpf, "password" => password}) do
    case Accounts.get_by_cpf(cpf) do
      {:ok, account} -> verify_hash(account, password)
      error -> error
    end
  end

  def call(_), do: {:error, :bad_request}

  def verify_hash(account, password) do
    case Argon2.verify_pass(password, account.password) do
      true -> {:ok, account}
      false -> {:error, :unauthorized}
    end
  end
end