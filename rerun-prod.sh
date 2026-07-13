#!/bin/bash
# Blue-green деплой без даунтайма.
# nginx на хосте держит upstream на оба порта (9100 blue / 9101 green),
# поэтому в момент переключения запросы прозрачно уходят на живой контейнер.
set -euo pipefail

COMPOSE="docker compose -p event-saver -f docker-compose.yaml"

is_running() {
  [ -n "$($COMPOSE ps --status running -q "$1" 2>/dev/null)" ]
}

if is_running event-saver-blue; then
  ACTIVE=event-saver-blue
  IDLE=event-saver-green
elif is_running event-saver-green; then
  ACTIVE=event-saver-green
  IDLE=event-saver-blue
else
  # Ни один цвет не запущен: первый деплой или миграция со старой схемы,
  # где контейнер сервиса event-saver ещё занимает порт 9100 — поднимаем green (9101).
  ACTIVE=""
  IDLE=event-saver-green
fi

echo "Deploying $IDLE (active: ${ACTIVE:-none})"

# Сборка идёт, пока старая версия продолжает работать
$COMPOSE build --pull "$IDLE"

# Поднимаем новую версию и ждём, пока healthcheck не станет healthy.
# Если не поднялась — скрипт упадёт, старая версия останется работать.
$COMPOSE up -d --wait --wait-timeout 120 "$IDLE"

# Новая версия принимает трафик, гасим старую (SIGTERM -> graceful shutdown).
# Контейнер удаляем, чтобы после ребута сервера не поднялась старая версия.
if [ -n "$ACTIVE" ]; then
  $COMPOSE stop "$ACTIVE"
  $COMPOSE rm -f "$ACTIVE"
fi

# Убираем контейнеры старой схемы деплоя (сервис event-saver), если остались
$COMPOSE up -d --no-recreate --remove-orphans redis "$IDLE"

docker image prune -f > /dev/null
echo "Deploy finished: $IDLE is live"
