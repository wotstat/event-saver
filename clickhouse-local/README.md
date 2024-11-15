

# Конфигурация CH

## Создание админа
Даём права `default`

```xml
<clickhouse>
  <users>
    <default>
      <access_management>1</access_management>
      <named_collection_control>1</named_collection_control>
      <show_named_collections>1</show_named_collections>
      <show_named_collections_secrets>1</show_named_collections_secrets>
    </default>
  </users>
</clickhouse>
```

Создаём юзера и даём ему права 

```sql
CREATE USER if not exists admin IDENTIFIED WITH sha256_password BY 'PASSWORD';
GRANT ALL ON *.* TO admin WITH GRANT OPTION;
```

Отключаем права `default`