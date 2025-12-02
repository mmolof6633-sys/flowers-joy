import { Request, Response, NextFunction } from "express";
import { Error } from "mongoose";

export interface AppError extends Error {
  statusCode?: number;
  code?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Внутренняя ошибка сервера";

  // Ошибки Mongoose
  if (err instanceof Error.CastError) {
    statusCode = 400;
    message = "Некорректный ID";
  }

  if (err instanceof Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Дублирующееся значение";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Маршрут ${req.originalUrl} не найден`,
  });
};
