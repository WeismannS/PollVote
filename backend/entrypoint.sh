#!/bin/sh
set -e

echo "Running drizzle-kit push..."
cd /app/dist
bunx drizzle-kit push

echo "Starting application..."
exec "$@"
