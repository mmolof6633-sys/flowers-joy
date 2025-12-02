import dotenv from "dotenv";
import { User } from "../models/User";
import { connectDB } from "../config/database";

dotenv.config();

async function createAdmin() {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@flowers-joy.ru";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    // Проверяем, существует ли уже админ
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("⚠️  Администратор уже существует");
      console.log(`Email: ${adminEmail}`);
      process.exit(0);
    }

    // Создаем администратора
    const admin = await User.create({
      email: adminEmail,
      password: adminPassword,
      name: "Администратор",
      role: "admin",
      isActive: true,
    });

    console.log("✅ Администратор создан успешно!");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${adminPassword}`);
    console.log("⚠️  Сохраните эти данные в безопасном месте!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Ошибка при создании администратора:", error);
    process.exit(1);
  }
}

createAdmin();
