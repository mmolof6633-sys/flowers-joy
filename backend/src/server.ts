import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import { swaggerSpec } from "./config/swagger";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/errorHandler";

// Загрузка переменных окружения
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Подключение к базе данных
connectDB();

// Middleware безопасности
app.use(helmet());
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
}));

// Парсинг JSON и cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP
  message: "Слишком много запросов с этого IP, попробуйте позже",
});
app.use("/api/", limiter);

// Swagger документация
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Роуты
app.use("/api", routes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Обработка ошибок
app.use(notFound);
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📚 Swagger документация: http://localhost:${PORT}/api-docs`);
});

export default app;
