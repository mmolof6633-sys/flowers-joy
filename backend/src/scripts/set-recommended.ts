import dotenv from "dotenv";
import { Bouquet } from "../models/Bouquet";
import { connectDB } from "../config/database";

dotenv.config();

async function setRecommended() {
  try {
    await connectDB();

    // Сначала сбросим все рекомендуемые букеты
    await Bouquet.updateMany(
      { isRecommended: true },
      { isRecommended: false, recommendedOrder: 0 }
    );
    console.log("🔄 Сброшены все рекомендуемые букеты");

    // Найдем любые 8 букетов
    const bouquets = await Bouquet.find({ inStock: true })
      .limit(8)
      .sort({ createdAt: -1 });

    if (bouquets.length === 0) {
      console.log("❌ В базе данных нет букетов");
      process.exit(1);
    }

    if (bouquets.length < 8) {
      console.log(
        `⚠️  В базе данных только ${bouquets.length} букетов, будет помечено ${bouquets.length}`
      );
    }

    // Установим их как рекомендуемые с порядком
    const updatePromises = bouquets.map((bouquet, index) => {
      return Bouquet.updateOne(
        { _id: bouquet._id },
        {
          isRecommended: true,
          recommendedOrder: index + 1,
        }
      );
    });

    await Promise.all(updatePromises);

    console.log(`✅ Помечено ${bouquets.length} букетов как рекомендуемые:`);
    bouquets.forEach((bouquet, index) => {
      console.log(`   ${index + 1}. ${bouquet.name} (порядок: ${index + 1})`);
    });

    console.log("🎉 Готово!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Ошибка при установке рекомендуемых букетов:", error);
    process.exit(1);
  }
}

setRecommended();

