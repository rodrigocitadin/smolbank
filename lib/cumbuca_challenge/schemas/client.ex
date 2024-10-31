defmodule CumbucaChallenge.Client do
  use CumbucaChallenge.Schema

  schema "clients" do
    field :name, :string
    field :cpf, :string
    field :balance, :integer, default: 0

    timestamps()
  end
end
