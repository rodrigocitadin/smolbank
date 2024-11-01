defmodule CumbucaChallenge.Client do
  use CumbucaChallenge.Schema

  @client_params [:name, :cpf]

  schema "clients" do
    field :name, :string
    field :cpf, :string
    field :balance, :integer, default: 0

    timestamps()
  end

  def changeset(client, params \\ %{}) do
    client
    |> Ecto.Changeset.cast(params, @client_params)
    |> Ecto.Changeset.validate_required(@client_params)
    |> Ecto.Changeset.validate_format(:cpf, ~r/^[[:digit:]]+$/)
    |> Ecto.Changeset.validate_length(:cpf, is: 11)
    |> Ecto.Changeset.unique_constraint(:cpf)
  end
end
