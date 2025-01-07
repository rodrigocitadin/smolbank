defmodule CumbucaChallenge.Accounts.GetAll do
  alias CumbucaChallenge.Accounts.Account
  alias CumbucaChallenge.Repo

  def call(), do: Repo.all(Account)
end
