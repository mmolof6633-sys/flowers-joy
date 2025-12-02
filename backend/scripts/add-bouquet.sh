#!/bin/bash

# Скрипт для добавления букета через API
# Использование: ./add-bouquet.sh TOKEN

TOKEN=$1
API_URL="http://localhost:3000/api/admin/bouquets"

if [ -z "$TOKEN" ]; then
  echo "❌ Ошибка: Укажите JWT токен"
  echo "Использование: ./add-bouquet.sh YOUR_TOKEN"
  echo ""
  echo "Получить токен:"
  echo "curl -X POST http://localhost:3000/api/auth/login \\"
  echo "  -H 'Content-Type: application/json' \\"
  echo "  -d '{\"email\":\"admin@flowers-joy.ru\",\"password\":\"admin123\"}'"
  exit 1
fi

echo "📝 Добавление нового букета..."
echo ""

# Пример данных - измените под свои нужды
curl -X POST "$API_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новый букет",
    "price": 2500,
    "images": ["https://example.com/image.jpg"],
    "categoryIds": [],
    "tags": ["новинка"],
    "inStock": true,
    "description": "Описание букета"
  }' | jq '.'

echo ""
echo "✅ Готово!"




