defmodule CumbucaChallenge.Accounts.Verify do
  alias CumbucaChallenge.Accounts

  def call(%{cpf: cpf, password: password}) do
    case Accounts.get_by_cpf(cpf) do
      {:ok, account} -> verify_hash(account, password)
      error -> error
    end
  end

  def verify_hash(account, password) do
    case Argon2.verify_pass(password, account.password) do
      true -> {:ok, account}
      false -> {:error, :unauthorized}
    end
  end
end
