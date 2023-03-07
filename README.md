# Микросервис сохранения событий в БД

## CI/CD

GitHub Actions настроен так, что состояние ветки **main** соответствует [dev.wotstat](https://dev.wotstat.soprachev.com/) поддомену. Теги – релизу.

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
