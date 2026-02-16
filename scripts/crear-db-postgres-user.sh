#!/usr/bin/env bash
# Plan B: crear la BD como usuario postgres y poner contraseña a postgres.
# Ejecutar como root: ./scripts/crear-db-postgres-user.sh
# Luego en .env usa: DATABASE_URL="postgresql://postgres:dev@localhost:5432/backend_fiesta?schema=public"

set -e
PASS="${1:-dev}"

echo "==> Estableciendo contraseña del usuario postgres y creando BD..."
sudo -u postgres psql -v ON_ERROR_STOP=1 <<EOF
ALTER ROLE postgres WITH PASSWORD '${PASS}';
CREATE DATABASE backend_fiesta OWNER postgres;
EOF
echo "==> Listo. Usa en .env: DATABASE_URL=\"postgresql://postgres:${PASS}@localhost:5432/backend_fiesta?schema=public\""
