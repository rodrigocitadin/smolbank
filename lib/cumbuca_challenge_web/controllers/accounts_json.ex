defmodule CumbucaChallengeWeb.AccountsJSON do
  def create(%{account: account}) do
    %{
      message: "Account created successfully",
      data: account
    }
  end

  def auth(%{token: token}) do
    %{
      message: "Account authenticated successfully",
      bearer: token
    }
  end
end
