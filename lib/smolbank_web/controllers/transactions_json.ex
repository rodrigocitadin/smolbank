defmodule SmolbankWeb.TransactionsJSON do
  def created(%{transaction: transaction}) do
    %{
      message: "Transaction done successfully",
      data: transaction
    }
  end

  def refund(%{transaction: transaction}) do
    %{
      message: "Transaction refund successfully",
      data: transaction
    }
  end
end
