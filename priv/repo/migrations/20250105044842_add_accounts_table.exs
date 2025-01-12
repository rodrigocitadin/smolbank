defmodule Smolbank.Repo.Migrations.AddAccountsTable do
  use Ecto.Migration

  def change do
    create table(:accounts, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :name, :string, null: false
      add :password, :string, null: false
      add :cpf, :string, null: false
      add :balance, :decimal, null: false, default: 100
      add :debt, :decimal, null: false, default: 0

      timestamps()
    end

    create unique_index(:accounts, [:cpf])
    create constraint(:accounts, :balance_must_be_positive, check: "balance >= 0")
    create constraint(:accounts, :debt_must_be_negative, check: "balance >= 0")
  end
end
