# Просмотр базы данных MongoDB

## Способ 1: MongoDB Compass (GUI - Рекомендуется)

1. Скачайте и установите: https://www.mongodb.com/try/download/compass
2. Откройте Compass
3. Подключитесь: `mongodb://localhost:27017`
4. Выберите базу данных: `flowers-joy`

## Способ 2: MongoDB Shell (mongosh)

### Установка
```bash
brew install mongosh
```

### Подключение
```bash
mongosh mongodb://localhost:27017/flowers-joy
```

### Полезные команды

```javascript
// Показать все базы данных
show dbs

// Использовать базу данных
use flowers-joy

// Показать все коллекции
show collections

// Посмотреть все категории
db.categories.find().pretty()

// Посмотреть все букеты
db.bouquets.find().pretty()

// Посмотреть букет с populate категорий (нужно делать через Mongoose)
db.bouquets.findOne().categoryIds

// Подсчитать количество документов
db.categories.countDocuments()
db.bouquets.countDocuments()

// Найти по slug
db.categories.findOne({ slug: "authorskie" })
db.bouquets.findOne({ slug: "rozy-cashmere" })

// Найти букеты в определенной категории
db.bouquets.find({ categoryIds: ObjectId("...") })

// Очистить коллекцию
db.categories.deleteMany({})
db.bouquets.deleteMany({})

// Удалить индексы (если нужно)
db.categories.dropIndexes()
db.bouquets.dropIndexes()
```

## Способ 3: VS Code расширение

Установите расширение "MongoDB for VS Code" в VS Code/Cursor.

## Способ 4: Онлайн инструменты

- Studio 3T (платный, есть бесплатная версия)
- NoSQLBooster (платный)





