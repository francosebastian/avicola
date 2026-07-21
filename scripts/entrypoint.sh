#!/bin/sh
set -e

echo "→ Verificando DATABASE_URL..."
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL no está configurada"
  exit 1
fi

echo "→ Ejecutando migraciones..."
npx prisma generate
npx prisma migrate deploy

if [ ! -f /tmp/.seed_done ]; then
  echo "→ Ejecutando seed inicial..."
  npx tsx prisma/seed.ts && touch /tmp/.seed_done
fi

echo "→ Iniciando aplicación..."
exec "$@"
