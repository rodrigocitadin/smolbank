defmodule Smolbank.Accounts.GetByCpf do
  alias Smolbank.Accounts.Account
  alias Smolbank.Repo

  def call(cpf) do
    case Repo.get_by(Account, cpf: cpf) do
      %Account{} = account -> {:ok, account}
      _ -> {:error, :not_found}
    end
  end
end
