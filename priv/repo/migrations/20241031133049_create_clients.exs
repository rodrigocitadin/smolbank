defmodule CumbucaChallenge.Repo.Migrations.CreateClients do
  use Ecto.Migration

  def change do
    create table(:clients, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :name, :string, null: false
      add :cpf, :string, null: false
      add :balance, :integer, null: false

      timestamps()
    end
  end
end
