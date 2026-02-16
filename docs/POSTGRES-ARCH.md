# PostgreSQL en Arch Linux – backend-fiesta

Pasos para tener PostgreSQL en Arch, crear la base de datos y aplicar las migraciones de Prisma.

## 1. Instalar PostgreSQL

```bash
sudo pacman -S postgresql
```

## 2. Inicializar el clúster (solo la primera vez)

En Arch el servicio no arranca hasta que el clúster esté inicializado. Como root:

```bash
cd /home/david/backend-fiesta
chmod +x scripts/init-postgres-arch.sh
sudo ./scripts/init-postgres-arch.sh
```

Si prefieres hacerlo a mano:

```bash
sudo -u postgres initdb -D /var/lib/postgres/data --locale=C -E UTF8
sudo systemctl start postgresql
```

## 3. Crear usuario y base de datos

Luego (como root o con sudo):

```bash
DB_PASS=dev ./scripts/setup-postgres-arch.sh
```

(Sustituye `dev` por la contraseña que quieras para el usuario de la base de datos.)

El script:

- Instala `postgresql` con pacman si no está instalado.
- Habilita e inicia el servicio `postgresql`.
- Crea el usuario `backend_fiesta` con la contraseña que pasaste en `DB_PASS`.
- Crea la base de datos `backend_fiesta`.

## 4. Configurar `.env`

Copia el ejemplo y ajusta la contraseña (la misma que usaste en el paso 3):

```bash
cp .env.example .env
```

Contenido de `.env` (con la contraseña que elegiste):

```env
DATABASE_URL="postgresql://backend_fiesta:dev@localhost:5432/backend_fiesta?schema=public"
PORT=3000
CONTACT_PHONE=+34912345678
```

## 5. Aplicar migraciones de Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Con eso se crean todas las tablas en la base `backend_fiesta`.

## Comandos útiles

- Ver estado del servicio: `sudo systemctl status postgresql`
- Conectar a la BD: `psql -U backend_fiesta -d backend_fiesta -h localhost`
- Abrir Prisma Studio: `npx prisma studio`
