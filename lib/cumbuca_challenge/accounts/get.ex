defmodule CumbucaChallenge.Accounts.Get do
  alias CumbucaChallenge.Accounts.Account
  alias CumbucaChallenge.Repo

  def call(id, opts \\ []) do
    case Repo.get(Account, id, opts) do
      %Account{} = account -> {:ok, account}
      _ -> {:error, :not_found}
    end
  end
end
