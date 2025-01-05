defmodule CumbucaChallenge.Accounts.Create do
  alias CumbucaChallenge.Accounts.Account
  alias CumbucaChallenge.Repo

  def call(params) do
    params
    |> Account.changeset()
    |> Repo.insert()
  end
end
