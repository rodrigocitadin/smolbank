defmodule Smolbank.Accounts.Update do
  alias Smolbank.Accounts.Account
  alias Smolbank.Accounts
  alias Smolbank.Repo

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
