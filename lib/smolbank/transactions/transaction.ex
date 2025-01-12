defmodule Smolbank.Transactions.Transaction do
  use Smolbank.Schema

  alias Smolbank.Accounts.Account

  @transaction_params [:amount, :receiver_id, :sender_id]
  @transaction_status [:pending, :finished, :cancelled, :revoked]
  @transaction_update_params [:status | @transaction_params]

  @derive {Jason.Encoder, only: [:id, :amount, :sender, :receiver, :status]}
  schema "transactions" do
    field :amount, :decimal
    field :status, Ecto.Enum, values: @transaction_status, default: :pending

    belongs_to :receiver, Account
    belongs_to :sender, Account

    timestamps()
  end

  def changeset(params) do
    %__MODULE__{}
    |> Ecto.Changeset.cast(params, @transaction_params)
    |> changeset_validations()
  end

  def changeset(transaction, params) do
    transaction
    |> Ecto.Changeset.cast(params, @transaction_update_params)
    |> changeset_validations()
  end

  defp changeset_validations(changeset) do
    changeset
    |> Ecto.Changeset.validate_required(@transaction_params)
    |> Ecto.Changeset.validate_number(:amount, greater_than_or_equal_to: 0)
    |> Ecto.Changeset.validate_inclusion(:status, @transaction_status)
  end
end
