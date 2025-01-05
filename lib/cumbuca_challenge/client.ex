defmodule CumbucaChallenge.Client do
  use CumbucaChallenge.Schema

  @client_params [:name, :cpf, :password]

  schema "clients" do
    field :name, :string
    field :cpf, :string
    field :password, :string
    field :balance, :integer, default: 100

    timestamps()
  end

  def changeset(client \\ %__MODULE__{}, params) do
    client
    |> Ecto.Changeset.cast(params, @client_params)
    |> Ecto.Changeset.validate_required(@client_params)
    |> Ecto.Changeset.validate_format(:cpf, ~r/^[[:digit:]]+$/)
    |> Ecto.Changeset.validate_length(:cpf, is: 11)
    |> Ecto.Changeset.validate_length(:password, min: 6)
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
