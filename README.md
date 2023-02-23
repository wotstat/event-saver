# Микросервис сохранения событий в БД

## CI/CD

GitHub Actions настроен так, что состояние ветки **main** соответствует [dev.wotstat](https://dev.wotstat.soprachev.com/) поддомену. Теги – релизу.

## Быстрый запуск

С помощью Docker Compose. Подробнее в соответствующем репозитории.

## Установка

### ClickHouse

Официальный туториал [clickhouse.tech/docs](https://clickhouse.tech/docs/ru/getting-started/install/)

Для тестов рекомендую использовать [Docker](https://www.docker.com)

PATH_DB это путь до места, где будут храниться данные БД

```
docker run -d --name clickhouse-server -p 8123:8123 --volume=$PATH_DB:/var/lib/clickhouse yandex/clickhouse-server
```

После запуска по очереди применятся все миграции и база данных наполняется нужными таблицами.

Подключаться рекомендую [DataGrip](https://www.jetbrains.com/datagrip/)

- Host: localhost
- Port: 8123
- User: default
- Password: **[отсутствует]**

### Nodejs

```
npm i
```

### [Опционально] [Прокси сервер](https://clickhouse.tech/docs/ru/interfaces/third-party/proxy/)

Я использую [clickhouse-bulk](https://github.com/nikepan/clickhouse-bulk)

### REDIS

Ну в общем он нужен.

## Запуск

В тестовом режиме и локальном окружении

```
npm run serve
```

В тестовом режиме и dev окружении (подключение к порд бд)

```
npm run serve:dev
```

В продакшен запускается через compose

## Миграции

### Обновление

При запуске сервера автоматически запускаются все неприменённые миграции в нужном окружение. Можно запустить миграцию вручную:

В окружение _default_

```
npm run migrate
```

В окружение _dev_

```
npm run migrate:dev
```

В окружение _production_

```
npm run migrate:prod
```

### Откат

Отменяет последнюю применённую миграцию

В окружение _default_

```
npm run rollBack
```

В окружение _dev_

```
npm run rollBack:dev
```

В окружение _production_

```
npm run rollBack:prod
```
