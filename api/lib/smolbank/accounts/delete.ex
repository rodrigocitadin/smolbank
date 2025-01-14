defmodule Smolbank.Accounts.Delete do
  alias Smolbank.Accounts
  alias Smolbank.Repo

  def call(id) do
    with {:ok, account} <- Accounts.get(id) do
      Repo.delete(account)
    end
  end
end
