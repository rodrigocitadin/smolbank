defmodule Smolbank.Repo.Migrations.AddTransactionStatusEnum do
  use Ecto.Migration

  def up do
    execute(
      "CREATE TYPE transaction_status AS ENUM ('pending', 'finished', 'cancelled', 'revoked')"
    )
  end

  def down do
    execute("DROP TYPE transaction_status")
  end
end
