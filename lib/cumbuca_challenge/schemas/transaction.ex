defmodule CumbucaChallenge.Transaction do
  use CumbucaChallenge.Schema

  @transaction_status [:unknown, :success, :fail, :processing]

  schema "transactions" do
    field :amount, :integer
    field :status, Ecto.Enum, values: @transaction_status, default: :processing

    belongs_to :receiver, CumbucaChallenge.Client
    belongs_to :sender, CumbucaChallenge.Client

    timestamps()
  end
end
