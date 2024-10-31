defmodule CumbucaChallenge.Repo.Migrations.CreateTransactions do
  use Ecto.Migration

  def change do
    create table(:transactions, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :receiver_id, references("clients", type: :uuid)
      add :sender_id, references("clients", type: :uuid)
      add :amount, :integer, null: false
      add :status, :string, null: false

      timestamps()
    end
  end
end
