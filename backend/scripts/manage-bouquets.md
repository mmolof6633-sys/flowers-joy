# Управление букетами (товарами)

## 🔐 Шаг 1: Получение JWT токена администратора

Сначала нужно войти как администратор и получить токен:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@flowers-joy.ru",
    "password": "admin123"
  }'
```

Ответ:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Сохраните токен!** Он понадобится для всех admin запросов.

---

## ➕ Добавление букета

### Через curl

```bash
curl -X POST http://localhost:3000/api/admin/bouquets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Розы Cashmere",
    "price": 3500,
    "oldPrice": 4200,
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "categoryIds": ["CATEGORY_ID_1", "CATEGORY_ID_2"],
    "tags": ["розы", "премиум"],
    "inStock": true,
    "sortOrder": 1,
    "description": "Роскошный букет из роз премиум-качества"
  }'
```

### Через Postman

1. Метод: `POST`
2. URL: `http://localhost:3000/api/admin/bouquets`
3. Headers:
   - `Authorization: Bearer YOUR_TOKEN_HERE`
   - `Content-Type: application/json`
4. Body (JSON):
```json
{
  "name": "Розы Cashmere",
  "price": 3500,
  "oldPrice": 4200,
  "images": ["https://example.com/image1.jpg"],
  "categoryIds": ["64f...", "64g..."],
  "tags": ["розы", "премиум"],
  "inStock": true,
  "sortOrder": 1,
  "description": "Роскошный букет"
}
```

### Через Swagger UI

1. Откройте: http://localhost:3000/api-docs
2. Найдите `POST /api/admin/bouquets`
3. Нажмите "Authorize" и вставьте токен
4. Заполните форму и отправьте

---

## 📝 Получение списка букетов

```bash
curl -X GET http://localhost:3000/api/admin/bouquets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔍 Получение одного букета по ID

```bash
curl -X GET http://localhost:3000/api/admin/bouquets/BOUQUET_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ✏️ Обновление букета

```bash
curl -X PATCH http://localhost:3000/api/admin/bouquets/BOUQUET_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 4000,
    "inStock": false
  }'
```

Можно обновить только нужные поля, остальные останутся без изменений.

---

## 🗑️ Удаление букета

```bash
curl -X DELETE http://localhost:3000/api/admin/bouquets/BOUQUET_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📋 Как получить ID категорий?

### Через API

```bash
# Получить все категории
curl http://localhost:3000/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Через MongoDB

```javascript
// В mongosh
use flowers-joy
db.categories.find({}, { _id: 1, name: 1, slug: 1 })
```

---

## 💡 Примеры

### Пример 1: Добавить букет в категорию "Авторские"

```bash
# 1. Получить ID категории "Авторские"
curl http://localhost:3000/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" | grep -A 5 "authorskie"

# 2. Добавить букет
curl -X POST http://localhost:3000/api/admin/bouquets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новый букет",
    "price": 2500,
    "images": ["https://example.com/new.jpg"],
    "categoryIds": ["ID_КАТЕГОРИИ_АВТОРСКИЕ"],
    "tags": ["новинка"],
    "inStock": true
  }'
```

### Пример 2: Добавить букет в несколько категорий

```bash
curl -X POST http://localhost:3000/api/admin/bouquets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Розы Cashmere",
    "price": 3500,
    "images": ["https://example.com/roses.jpg"],
    "categoryIds": [
      "ID_АВТОРСКИЕ",
      "ID_МОНОБУКЕТЫ",
      "ID_НЕВЕСТЫ"
    ],
    "tags": ["розы", "премиум"],
    "inStock": true
  }'
```

---

## 🔄 Изменение порядка букетов

```bash
curl -X PATCH http://localhost:3000/api/admin/bouquets/reorder \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "bouquets": [
      { "id": "ID_1", "sortOrder": 1 },
      { "id": "ID_2", "sortOrder": 2 },
      { "id": "ID_3", "sortOrder": 3 }
    ]
  }'
```

---

## ⚠️ Важные замечания

1. **Токен истекает** через 7 дней (настраивается в `.env`)
2. **categoryIds** должны быть валидными MongoDB ObjectId
3. **images** должен содержать минимум 1 URL
4. **categoryIds** должен содержать минимум 1 ID
5. **slug** генерируется автоматически из названия

---

## 🛠️ Управление категориями

Аналогично букетам, но через `/api/admin/categories`:

```bash
# Создать категорию
curl -X POST http://localhost:3000/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новая категория",
    "description": "Описание",
    "image": "https://example.com/category.jpg",
    "isActive": true
  }'

# Удалить категорию
curl -X DELETE http://localhost:3000/api/admin/categories/CATEGORY_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```


