import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Токен не предоставлен" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: string;
    };

    const user = await User.findById(decoded.userId).select("+password");

    if (!user || !user.isActive) {
      res.status(401).json({ message: "Пользователь не найден или неактивен" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Недействительный токен" });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Требуется аутентификация" });
    return;
  }

  if (req.user.role !== "admin") {
    res
      .status(403)
      .json({ message: "Доступ запрещен. Требуется роль администратора" });
    return;
  }

  next();
};
