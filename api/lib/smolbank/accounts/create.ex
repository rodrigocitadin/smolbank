defmodule Smolbank.Accounts.Create do
  alias Smolbank.Accounts.Account
  alias Smolbank.Repo

  def call(params) do
    params
    |> Account.changeset()
    |> Repo.insert()
  end
end
