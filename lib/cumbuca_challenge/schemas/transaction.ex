defmodule CumbucaChallenge.Transaction do
  use CumbucaChallenge.Schema

  @transaction_required_params [:amount, :receiver_id, :sender_id]
  @transaction_params [:status | @transaction_required_params]
  @transaction_status [:unknown, :success, :fail, :processing]

  schema "transactions" do
    field :amount, :integer
    field :status, Ecto.Enum, values: @transaction_status, default: :processing

    belongs_to :receiver, CumbucaChallenge.Client
    belongs_to :sender, CumbucaChallenge.Client

    timestamps()
  end

  def changeset(transaction, params \\ %{}) do
    transaction
    |> Ecto.Changeset.cast(params, @transaction_params)
    |> Ecto.Changeset.validate_required(@transaction_required_params)
    |> Ecto.Changeset.validate_inclusion(:status, @transaction_status)
  end
end
