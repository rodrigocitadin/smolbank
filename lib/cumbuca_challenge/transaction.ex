defmodule CumbucaChallenge.Transaction do
  use CumbucaChallenge.Schema

  alias CumbucaChallenge.Accounts.Account

  @transaction_params [:amount, :receiver_id, :sender_id]
  @transaction_status [:pending, :finished, :cancelled, :refunded]

  schema "transactions" do
    field :amount, :integer
    field :status, Ecto.Enum, values: @transaction_status, default: :pending

    belongs_to :receiver, Account
    belongs_to :sender, Account

    timestamps()
  end

  def changeset(transaction \\ %__MODULE__{}, params) do
    transaction
    |> Ecto.Changeset.cast(params, @transaction_params)
    |> Ecto.Changeset.validate_required(@transaction_params)
  end
end
