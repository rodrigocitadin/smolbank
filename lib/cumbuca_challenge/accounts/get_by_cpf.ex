defmodule CumbucaChallenge.Accounts.GetByCpf do
  alias CumbucaChallenge.Accounts.Account
  alias CumbucaChallenge.Repo

  def call(cpf) do
    case Repo.get_by(Account, cpf: cpf) do
      %Account{} = account -> {:ok, account}
      _ -> {:error, :not_found}
    end
  end
end
