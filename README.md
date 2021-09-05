# Микросервис сохранения событий в БД

## CI/CD
GitHub Actions настроен так, что состояние ветки **master** соответствует [dev.wotstat](https://dev.wotstat.soprachev.com/) поддомену.

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
* Host: localhost
* Port: 8123
* User: default
* Password: **[отсутствует]**

### Nodejs

```
npm i
```

### [Опционально] [Прокси сервер](https://clickhouse.tech/docs/ru/interfaces/third-party/proxy/)
Я использую [clickhouse-bulk](https://github.com/nikepan/clickhouse-bulk)


## Запуск
В тестовом режиме
```
npm run serve
```

## Миграции

### Обновление
При запуске сервера автоматически запускаются все неприменённые миграции в нужном окружение. Можно запустить миграцию вручную:

В окружение *default*
```
npm run migrate
```
В окружение *dev*
```
npm run migrate:dev
```
В окружение *production*
```
npm run migrate:prod
```

### Откат

Отменяет последнюю применённую миграцию

В окружение *default*
```
npm run rollBack
```
В окружение *dev*
```
npm run rollBack:dev
```
В окружение *production*
```
npm run rollBack:prod
```