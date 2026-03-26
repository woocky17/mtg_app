#!/bin/sh
set -e

# Export env vars to a file so cron can source them
env | grep -E '^(DATABASE_URL|NODE_ENV|PATH)=' > /app/.env.cron

# Build crontab with env sourcing
echo "0 4 * * * . /app/.env.cron && cd /app && npx tsx scripts/sync-scryfall.ts >> /var/log/sync.log 2>&1" > /etc/crontabs/root

echo "[mtg-sync] Running database migrations..."
npx prisma migrate deploy

echo "[mtg-sync] Running initial sync..."
cd /app && npx tsx scripts/sync-scryfall.ts

echo "[mtg-sync] Initial sync done. Starting cron (daily at 04:00 UTC)..."
crond -f -l 2
