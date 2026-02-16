#!/usr/bin/env bash
# Inicializa el clúster de PostgreSQL en Arch (solo hace falta la primera vez).
# Ejecutar como root después de instalar postgresql si el servicio no arranca.
# Uso: sudo ./scripts/init-postgres-arch.sh

set -e

DATA_DIR="${PGROOT:-/var/lib/postgres}/data"

echo "==> Comprobando clúster de PostgreSQL en ${DATA_DIR}..."

if [ ! -d "$DATA_DIR" ]; then
  echo "    Creando directorio de datos y asignando propietario postgres..."
  mkdir -p "$DATA_DIR"
  chown -R postgres:postgres "$(dirname "$DATA_DIR")"
fi

# Si no está inicializado (no existe PG_VERSION), ejecutar initdb
if [ ! -f "$DATA_DIR/PG_VERSION" ]; then
  echo "==> Inicializando clúster (initdb)..."
  sudo -u postgres initdb -D "$DATA_DIR" --locale="${LANG:-C}" -E UTF8
  echo "    Clúster creado."
else
  echo "    El clúster ya está inicializado."
fi

echo "==> Iniciando servicio PostgreSQL..."
systemctl start postgresql
systemctl status postgresql --no-pager || true

echo ""
echo "==> Listo. Ahora puedes ejecutar:"
echo "    DB_PASS=dev ./scripts/setup-postgres-arch.sh"
echo "    (para crear usuario y base de datos backend_fiesta)"
