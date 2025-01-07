defmodule CumbucaChallenge.Repo.Migrations.AddTransactionsTable do
  use Ecto.Migration

  def change do
    create table(:transactions, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :sender_id, references("accounts", type: :uuid)
      add :receiver_id, references("accounts", type: :uuid)
      add :amount, :decimal, null: false
      add :status, :transaction_status, null: false

      timestamps()
    end

    create constraint(:transactions, :amount_must_be_positive, check: "amount >= 0")
  end
end
