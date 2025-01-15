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

  def all(%{transactions: transactions}) do
    %{
      message: "All transactions found with given id",
      data: transactions
    }
  end
end
