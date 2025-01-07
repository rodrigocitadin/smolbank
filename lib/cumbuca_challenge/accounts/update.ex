defmodule CumbucaChallenge.Accounts.Update do
  alias CumbucaChallenge.Accounts.Account
  alias CumbucaChallenge.Accounts
  alias CumbucaChallenge.Repo

  def call(%{"id" => id} = params) do
    with {:ok, account} <- Accounts.get(id) do
      update(account, params)
    end
  end

  defp update(account, params) do
    account
    |> Account.changeset(params)
    |> Repo.update()
  end
end
