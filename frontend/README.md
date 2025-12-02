# Flowers Joy - Frontend

Frontend приложение цветочного магазина на Next.js 15 с архитектурой Feature-Sliced Design.

## Технологии

- Next.js 15 (App Router)
- TypeScript
- MUI v6
- TanStack React Query v5
- Feature-Sliced Design

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

**Важно:** Убедитесь, что бэкенд запущен на порту 3001. API URL настраивается через переменную окружения `NEXT_PUBLIC_API_URL` (по умолчанию: `http://localhost:3001/api`).

## Сборка

```bash
npm run build
npm start
```

## Линтинг и форматирование

```bash
npm run lint
npm run format
```

