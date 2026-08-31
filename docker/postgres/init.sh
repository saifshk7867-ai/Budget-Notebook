#!/bin/bash
set -e

echo "Initializing Budget Notebook database..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -f /docker-entrypoint-initdb.d/schema/01_users_schema.sql

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -f /docker-entrypoint-initdb.d/schema/03_budget_schema.sql

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -f /docker-entrypoint-initdb.d/schema/04_transaction_schema.sql

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -f /docker-entrypoint-initdb.d/seeds/01_users_seeds.sql

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -f /docker-entrypoint-initdb.d/seeds/03_budget_seeds.sql

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -f /docker-entrypoint-initdb.d/seeds/04_transactions_seeds.sql

echo "Budget Notebook database initialized successfully."
