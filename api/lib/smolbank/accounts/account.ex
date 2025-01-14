defmodule Smolbank.Accounts.Account do
  use Smolbank.Schema

  alias Smolbank.Transactions.Transaction

  @account_params [:name, :cpf, :password]
  @account_update_params [:balance, :debt | @account_params]

  @derive {Jason.Encoder, only: [:id, :name, :cpf, :balance, :debt]}
  schema "accounts" do
    field :name, :string
    field :cpf, :string
    field :password, :string
    field :balance, :decimal, default: 100
    field :debt, :decimal, default: 0

    has_many :sent_transactions, Transaction, foreign_key: :sender_id
    has_many :received_transactions, Transaction, foreign_key: :receiver_id

    timestamps()
  end

  def changeset(params) do
    %__MODULE__{}
    |> Ecto.Changeset.cast(params, @account_params)
    |> changeset_validations()
  end

  def changeset(account, params) do
    account
    |> Ecto.Changeset.cast(params, @account_update_params)
    |> changeset_validations()
  end

  defp changeset_validations(changeset) do
    changeset
    |> Ecto.Changeset.validate_required(@account_params)
    |> Ecto.Changeset.validate_format(:cpf, ~r/^[[:digit:]]+$/)
    |> Ecto.Changeset.validate_length(:cpf, is: 11)
    |> Ecto.Changeset.validate_length(:password, min: 6)
    |> Ecto.Changeset.validate_number(:balance, greater_than_or_equal_to: 0)
    |> Ecto.Changeset.validate_number(:debt, greater_than_or_equal_to: 0)
    |> Ecto.Changeset.unique_constraint(:cpf)
    |> put_password_hash()
  end

  defp put_password_hash(
         %Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset
       ) do
    Ecto.Changeset.change(changeset, password: Argon2.hash_pwd_salt(password))
  end

  defp put_password_hash(changeset), do: changeset
end
