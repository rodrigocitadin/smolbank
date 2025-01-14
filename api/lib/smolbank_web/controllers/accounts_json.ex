defmodule SmolbankWeb.AccountsJSON do
  def create(%{account: account}) do
    %{
      message: "Account created successfully",
      data: account
    }
  end

  def update(%{account: account}) do
    %{
      message: "Account updated successfully",
      data: account
    }
  end

  def index(%{account: account}) do
    %{
      message: "Account found",
      data: account
    }
  end

  def all(%{accounts: accounts}) do
    %{
      message: "All accounts found",
      data: accounts
    }
  end

  def auth(%{token: token}) do
    %{
      message: "Account authenticated successfully",
      bearer: token
    }
  end
end
