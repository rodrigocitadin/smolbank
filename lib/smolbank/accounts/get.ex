defmodule Smolbank.Accounts.Get do
  alias Smolbank.Accounts.Account
  alias Smolbank.Repo

  def call(id, opts \\ []) do
    case Repo.get(Account, id, opts) do
      %Account{} = account -> {:ok, account}
      _ -> {:error, :not_found}
    end
  end
end
