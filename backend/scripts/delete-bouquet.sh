#!/bin/bash

# Скрипт для удаления букета через API
# Использование: ./delete-bouquet.sh TOKEN BOUQUET_ID

TOKEN=$1
BOUQUET_ID=$2
API_URL="http://localhost:3000/api/admin/bouquets"

if [ -z "$TOKEN" ] || [ -z "$BOUQUET_ID" ]; then
  echo "❌ Ошибка: Укажите токен и ID букета"
  echo "Использование: ./delete-bouquet.sh TOKEN BOUQUET_ID"
  exit 1
fi

echo "🗑️  Удаление букета $BOUQUET_ID..."
echo ""

curl -X DELETE "$API_URL/$BOUQUET_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "✅ Готово!"




