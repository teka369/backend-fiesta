#!/usr/bin/env bash
# Configura PostgreSQL en Arch Linux y crea la base de datos para backend-fiesta.
# Uso: ./scripts/setup-postgres-arch.sh
# Con contraseña: DB_USER=backend_fiesta DB_PASS=mipassword ./scripts/setup-postgres-arch.sh

set -e

DB_NAME="${DB_NAME:-backend_fiesta}"
DB_USER="${DB_USER:-backend_fiesta}"

echo "==> Instalando PostgreSQL..."
if ! command -v psql &>/dev/null; then
  sudo pacman -S --noconfirm postgresql
fi

echo "==> Habilitando PostgreSQL..."
sudo systemctl enable postgresql 2>/dev/null || true

DATA_DIR="${PGROOT:-/var/lib/postgres}/data"
HBA="$DATA_DIR/pg_hba.conf"

# Si ya hay algo en 5432 (p. ej. systemd), usarlo
if pg_isready -h 127.0.0.1 -p 5432 -q 2>/dev/null; then
  echo "    PostgreSQL ya está en marcha."
  PGHOST=""
  for PGHOST in /run/postgresql "$DATA_DIR"; do
    sudo -u postgres PGHOST="$PGHOST" psql -tc "SELECT 1" &>/dev/null && break
  done
else
  # PostgreSQL en Arch usa unix_socket_directories=/run/postgresql; crear el directorio
  if [ ! -d /run/postgresql ]; then
    mkdir -p /run/postgresql
    chown postgres:postgres /run/postgresql
  fi
  # Quitar postmaster.pid si quedó de un cierre incorrecto
  sudo -u postgres rm -f "$DATA_DIR/postmaster.pid" 2>/dev/null || true
  echo "    Arrancando PostgreSQL con pg_ctl..."
  if ! sudo -u postgres pg_ctl -D "$DATA_DIR" -l "$DATA_DIR/logfile" start; then
    echo ""
    echo "Error: PostgreSQL no arrancó. Últimas líneas del registro:"
    sudo -u postgres tail -20 "$DATA_DIR/logfile" 2>/dev/null || true
    echo ""
    echo "Registro completo: $DATA_DIR/logfile"
    exit 1
  fi
  sleep 3
  PGHOST="$DATA_DIR"
fi

# Si la conexión por socket falla, poner trust en pg_hba y recargar para usar 127.0.0.1
if ! sudo -u postgres PGHOST="$PGHOST" psql -tc "SELECT 1" &>/dev/null; then
  echo "==> Configurando trust para 127.0.0.1 en pg_hba.conf..."
  if ! sudo -u postgres grep -q '127.0.0.1/32.*trust' "$HBA" 2>/dev/null; then
    sudo -u postgres sed -i.bak '/127\.0\.0\.1\/32/s/scram-sha-256/trust/; /127\.0\.0\.1\/32/s/md5/trust/' "$HBA"
    sudo -u postgres sed -i.bak '/::1\/128/s/scram-sha-256/trust/; /::1\/128/s/md5/trust/' "$HBA"
  fi
  echo "    Recargando configuración de PostgreSQL..."
  if ! sudo -u postgres pg_ctl -D "$DATA_DIR" reload 2>/dev/null; then
    # Buscar el postmaster (proceso que escucha en 5432); puede ser el padre
    PG_PID=$(ss -tlnp 2>/dev/null | awk '/:5432 / {gsub(/.*pid=/, ""); gsub(/,.*/, ""); print}' | head -1)
    [ -z "$PG_PID" ] && PG_PID=$(fuser 5432/tcp 2>/dev/null | tr -d ' ')
    if [ -n "$PG_PID" ]; then
      kill -HUP "$PG_PID" 2>/dev/null && echo "    Recarga enviada al PID $PG_PID"
    fi
  fi
  sleep 2
  # Si el servidor dejó de responder (p. ej. SIGHUP lo cerró), arrancarlo de nuevo
  if ! pg_isready -h 127.0.0.1 -p 5432 -q 2>/dev/null; then
    echo "    Reiniciando PostgreSQL..."
    sudo -u postgres rm -f "$DATA_DIR/postmaster.pid" 2>/dev/null
    sudo -u postgres pg_ctl -D "$DATA_DIR" -l "$DATA_DIR/logfile" start
    sleep 3
  fi
  PGHOST="127.0.0.1"
fi

echo "==> Creando usuario y base de datos..."

if [ -n "$DB_PASS" ]; then
  sudo -u postgres psql -h "$PGHOST" -tc "SELECT 1 FROM pg_roles WHERE rolname = '${DB_USER}'" | grep -q 1 || \
    sudo -u postgres psql -h "$PGHOST" -c "CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASS}';"
  sudo -u postgres psql -h "$PGHOST" -c "ALTER ROLE ${DB_USER} WITH PASSWORD '${DB_PASS}';" 2>/dev/null || true
else
  sudo -u postgres createuser -h "$PGHOST" -s "$DB_USER" 2>/dev/null || true
fi

sudo -u postgres psql -h "$PGHOST" -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || \
  sudo -u postgres createdb -h "$PGHOST" -O "$DB_USER" "$DB_NAME"
# Prisma migrate necesita crear una BD shadow; dar permiso CREATEDB
sudo -u postgres psql -h "$PGHOST" -c "ALTER ROLE ${DB_USER} CREATEDB;" 2>/dev/null || true

echo ""
echo "==> PostgreSQL listo."
echo "    Base de datos: ${DB_NAME}"
echo "    Usuario:       ${DB_USER}"
if [ -n "$DB_PASS" ]; then
  echo "    DATABASE_URL=postgresql://${DB_USER}:****@localhost:5432/${DB_NAME}?schema=public"
else
  echo "    Para usar con Prisma, ejecuta con contraseña:"
  echo "    DB_PASS=tu_password ./scripts/setup-postgres-arch.sh"
fi
echo ""
echo "Siguiente: crea .env con DATABASE_URL y ejecuta: npx prisma migrate dev"
