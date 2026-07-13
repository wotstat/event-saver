# Микросервис сохранения событий в БД

## CI/CD

GitHub Actions настроен так, что состояние ветки **main** соответствует [dev.wotstat](https://dev.wotstat.soprachev.com/) поддомену. Теги – релизу.

## Деплой (prod, blue-green)

`rerun-prod.sh` делает деплой без даунтайма: в compose два одинаковых сервиса
`event-saver-blue` (порт **9100**) и `event-saver-green` (порт **9101**).
Скрипт собирает образ, поднимает неактивный цвет, ждёт healthcheck (`--wait`),
после чего гасит старый контейнер (SIGTERM → graceful shutdown: сервер дожидается
in-flight запросов и вставок в ClickHouse). Redis при деплое не перезапускается.

nginx на хосте должен проксировать `/api` на upstream с обоими портами (правится один раз):

```nginx
upstream event_saver {
  server 127.0.0.1:9100 max_fails=1 fail_timeout=10s; # blue
  server 127.0.0.1:9101 max_fails=1 fail_timeout=10s; # green
}

# внутри server { ... }
location /api {
  proxy_pass http://event_saver;
  proxy_next_upstream error timeout non_idempotent;
  proxy_next_upstream_tries 2;
  proxy_connect_timeout 2s;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

`non_idempotent` обязателен: события — это POST, и без него nginx не ретраит
запрос на живой порт, когда пассивная проверка натыкается на выключенный цвет.

Вайтлист ClickHouse менять не нужно: подсеть `172.25.0.0/16` запинена в compose
и покрывает оба контейнера, фиксированные IP не используются.

Откат — деплой предыдущего коммита (workflow_dispatch на нужном коммите).

## Установка и Запуск

Необходим установленный [Docker](https://www.docker.com/) и [Node.js](https://nodejs.org/en/).
Запуск командой из корня проекта:

```
npm run dev:docker
```

Запустит docker-compose сконфигурированный в `./dev/docker-compose.yml`. Локальное состояние БД и логи будут сохранены в `./dev/clickhouse`.

Для доступа к тестовой БД рекомендую [DataGrip](https://www.jetbrains.com/datagrip/)

- Driver: ClickHouse
- Host: localhost
- Port: 8123
- User: default
- Password: **[отсутствует]**

## Тестирование

В VSCode установить расширение [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client), перейти в его интерфейс, открыть вкладку коллекций.
В ней будут необходимые запросы с подготовленными данными.

По умолчанию порт для тестирования 9000. Можно изменить в `./dev/docker-compose.yml`

## Миграции

### Обновление

Подключиться к контейнеру с приложением и запустить команду migrate

```
docker exec -it <<ID>> bash
npm run migrate
```

### Откат

Подключиться к контейнеру с приложением и запустить команду rollback.

Откатывает последнюю миграцию.

```
docker exec -it <<ID>> bash
npm run rollback
```
