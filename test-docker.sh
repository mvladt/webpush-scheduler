#!/bin/bash
set -e  # Остановить на первой ошибке

echo "Starting Docker container..."
docker compose up --build -d --wait

echo "Running tests inside container..."
docker compose exec webpush-scheduler node --test testsDocker/**/*

echo "Stopping container..."
docker compose down

echo "Done!"
