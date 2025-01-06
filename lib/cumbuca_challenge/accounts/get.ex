defmodule CumbucaChallenge.Accounts.Get do
  alias CumbucaChallenge.Accounts.Account
  alias CumbucaChallenge.Repo

  def call(id) do
    case Repo.get(Account, id) do
      %Account{} = account -> {:ok, account}
      _ -> {:error, :not_found}
    end
  end
end
