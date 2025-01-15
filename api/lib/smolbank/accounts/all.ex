defmodule Smolbank.Accounts.All do
  alias Smolbank.Accounts.Account
  alias Smolbank.Repo

  def call(), do: Repo.all(Account)
end
