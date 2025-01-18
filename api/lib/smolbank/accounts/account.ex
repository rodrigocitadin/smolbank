defmodule Smolbank.Accounts.Account do
  use Smolbank.Schema

  import Ecto.Changeset

  alias Smolbank.Transactions.Transaction

  @account_params [:name, :email, :password]
  @account_update_params [:balance, :debt | @account_params]

  @derive {Jason.Encoder, only: [:id, :name, :email, :balance, :debt, :updated_at, :inserted_at]}
  schema "accounts" do
    field :name, :string
    field :email, :string
    field :password, :string
    field :balance, :decimal, default: 100
    field :debt, :decimal, default: 0

    has_many :sent_transactions, Transaction, foreign_key: :sender_id
    has_many :received_transactions, Transaction, foreign_key: :receiver_id

    timestamps()
  end

  def changeset(params) do
    %__MODULE__{}
    |> cast(params, @account_params)
    |> changeset_validations()
  end

  def changeset(account, params) do
    account
    |> cast(params, @account_update_params)
    |> changeset_validations()
  end

  defp changeset_validations(changeset) do
    changeset
    |> validate_required(@account_params)
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+\.[^\s]+$/, message: "must be a valid email")
    |> validate_length(:password, min: 8, message: "Be at least 8 characters long")
    |> validate_format(:password, ~r/[a-zA-Z]/, message: "Contain at least one letter.")
    |> validate_format(:password, ~r/[0-9]/, message: "Contain at least one number.")
    |> validate_format(:password, ~r/[^a-zA-Z0-9]/,
      message: "Contain at least one special character."
    )
    |> validate_number(:balance, greater_than_or_equal_to: 0)
    |> validate_number(:debt, greater_than_or_equal_to: 0)
    |> unique_constraint(:email)
    |> put_password_hash()
  end

  defp put_password_hash(
         %Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset
       ) do
    change(changeset, password: Argon2.hash_pwd_salt(password))
  end

  defp put_password_hash(changeset), do: changeset
end
