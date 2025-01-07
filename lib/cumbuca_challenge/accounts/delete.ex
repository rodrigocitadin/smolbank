defmodule CumbucaChallenge.Accounts.Delete do
  alias CumbucaChallenge.Accounts
  alias CumbucaChallenge.Repo

  def call(id) do
    with {:ok, account} <- Accounts.get(id) do
      Repo.delete(account)
    end
  end
end
