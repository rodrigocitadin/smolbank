defmodule Smolbank.Accounts.GetByEmail do
  alias Smolbank.Accounts.Account
  alias Smolbank.Repo

  def call(email) do
    case Repo.get_by(Account, email: email) do
      %Account{} = account -> {:ok, account}
      _ -> {:error, :not_found}
    end
  end
end
