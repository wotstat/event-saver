# Микросервис сохранения событий в БД

## Установка

### ClickHouse
Официальный туториал [clickhouse.tech/docs](https://clickhouse.tech/docs/ru/getting-started/install/)

Для тестов рекомендую использовать [Docker](https://www.docker.com)

PATH_DB это путь до места, где будут храниться данные БД

```
docker run -d --name clickhouse-server -p 8123:8123 --volume=$PATH_DB:/var/lib/clickhouse yandex/clickhouse-server
```

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