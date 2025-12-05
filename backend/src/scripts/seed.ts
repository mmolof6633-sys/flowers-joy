import dotenv from "dotenv";
import slugify from "slugify";
import { Category } from "../models/Category";
import { Bouquet } from "../models/Bouquet";
import { connectDB } from "../config/database";

dotenv.config();

const categoriesData = [
  {
    name: "ВСЕ",
    slug: "vse",
    sortOrder: 0,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1563241521-5eda60a6ac72?w=800&h=600&fit=crop",
  },
  {
    name: "АВТОРСКИЕ БУКЕТЫ",
    slug: "authorskie",
    sortOrder: 1,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1582794543139-8ac38803e6b7?w=800&h=600&fit=crop",
  },
  {
    name: "МОНОБУКЕТЫ",
    slug: "monobukety",
    sortOrder: 2,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1606041008023-472dfb5e8f11?w=800&h=600&fit=crop",
  },
  {
    name: "КОРОБКА",
    slug: "korobka",
    sortOrder: 3,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1606800053560-ee5e68e4e0a1?w=800&h=600&fit=crop",
  },
  {
    name: "КОРЗИНА",
    slug: "korzina",
    sortOrder: 4,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1606800053560-ee5e68e4e0a1?w=800&h=600&fit=crop",
  },
  {
    name: "ДУО&ТРИО",
    slug: "duo-trio",
    sortOrder: 5,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1606041008023-472dfb5e8f11?w=800&h=600&fit=crop",
  },
  {
    name: "НЕВЕСТЫ",
    slug: "nevesty",
    sortOrder: 6,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
  },
  {
    name: "ИНТЕРЬЕР",
    slug: "interer",
    sortOrder: 7,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1606041008023-472dfb5e8f11?w=800&h=600&fit=crop",
  },
  {
    name: "СЕЗОН",
    slug: "sezon",
    sortOrder: 8,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1606041008023-472dfb5e8f11?w=800&h=600&fit=crop",
  },
];

const bouquetsData = [
  {
    name: "Розы Cashmere",
    price: 3500,
    oldPrice: 4200,
    images: ["https://example.com/roses-cashmere.jpg"],
    categorySlugs: ["authorskie", "monobukety", "nevesty"],
    tags: ["розы", "премиум"],
    inStock: true,
    sortOrder: 1,
    description: "Роскошный букет из роз премиум-качества",
  },
  {
    name: 'Букет "Нежность"',
    price: 2500,
    images: ["https://example.com/nezhnost.jpg"],
    categorySlugs: ["authorskie", "korobka"],
    tags: ["нежность", "романтика"],
    inStock: true,
    sortOrder: 2,
  },
  {
    name: "Моно-букет из тюльпанов",
    price: 1800,
    images: ["https://example.com/tulips.jpg"],
    categorySlugs: ["monobukety", "sezon"],
    tags: ["тюльпаны", "весна"],
    inStock: true,
    sortOrder: 3,
  },
  {
    name: 'Коробка "Люкс"',
    price: 4500,
    oldPrice: 5500,
    images: ["https://example.com/lux-box.jpg"],
    categorySlugs: ["korobka", "interer"],
    tags: ["премиум", "коробка"],
    inStock: true,
    sortOrder: 4,
  },
  {
    name: 'Корзина "Праздник"',
    price: 3200,
    images: ["https://example.com/prazdnik.jpg"],
    categorySlugs: ["korzina", "interer"],
    tags: ["корзина", "праздник"],
    inStock: true,
    sortOrder: 5,
  },
  {
    name: 'Дуо "Весеннее настроение"',
    price: 2200,
    images: ["https://example.com/duo-spring.jpg"],
    categorySlugs: ["duo-trio"],
    tags: ["дуо", "весна"],
    inStock: true,
    sortOrder: 6,
  },
  {
    name: 'Букет невесты "Свадебный"',
    price: 5500,
    images: ["https://example.com/wedding.jpg"],
    categorySlugs: ["nevesty", "authorskie"],
    tags: ["свадьба", "невеста"],
    inStock: true,
    sortOrder: 7,
  },
  {
    name: 'Интерьерная композиция "Элегантность"',
    price: 4800,
    images: ["https://example.com/elegance.jpg"],
    categorySlugs: ["interer", "authorskie"],
    tags: ["интерьер", "элегантность"],
    inStock: true,
    sortOrder: 8,
  },
  {
    name: 'Сезонный букет "Осень"',
    price: 2800,
    images: ["https://example.com/autumn.jpg"],
    categorySlugs: ["sezon"],
    tags: ["осень", "сезон"],
    inStock: true,
    sortOrder: 9,
  },
  {
    name: 'Розы "Классика"',
    price: 2000,
    images: ["https://example.com/roses-classic.jpg"],
    categorySlugs: ["monobukety", "vse"],
    tags: ["розы", "классика"],
    inStock: true,
    sortOrder: 10,
  },
  {
    name: 'Трио "Радуга"',
    price: 3000,
    images: ["https://example.com/rainbow.jpg"],
    categorySlugs: ["duo-trio"],
    tags: ["трио", "яркий"],
    inStock: true,
    sortOrder: 11,
  },
  {
    name: 'Коробка "Мини"',
    price: 1500,
    images: ["https://example.com/mini-box.jpg"],
    categorySlugs: ["korobka"],
    tags: ["мини", "коробка"],
    inStock: true,
    sortOrder: 12,
  },
  {
    name: 'Букет "Романтика"',
    price: 2400,
    images: ["https://example.com/romance.jpg"],
    categorySlugs: ["authorskie", "vse"],
    tags: ["романтика"],
    inStock: true,
    sortOrder: 13,
  },
  {
    name: 'Корзина "Домашний уют"',
    price: 3600,
    images: ["https://example.com/cozy.jpg"],
    categorySlugs: ["korzina", "interer"],
    tags: ["корзина", "уют"],
    inStock: true,
    sortOrder: 14,
  },
  {
    name: 'Букет невесты "Мечта"',
    price: 6200,
    oldPrice: 7500,
    images: ["https://example.com/dream.jpg"],
    categorySlugs: ["nevesty"],
    tags: ["свадьба", "премиум"],
    inStock: true,
    sortOrder: 15,
  },
  {
    name: 'Сезонный "Новогодний"',
    price: 3200,
    images: ["https://example.com/newyear.jpg"],
    categorySlugs: ["sezon"],
    tags: ["новый год", "зима"],
    inStock: true,
    sortOrder: 16,
  },
  {
    name: "Моно-букет из пионов",
    price: 3800,
    images: ["https://example.com/peonies.jpg"],
    categorySlugs: ["monobukety", "sezon"],
    tags: ["пионы", "лето"],
    inStock: true,
    sortOrder: 17,
  },
  {
    name: 'Коробка "Макси"',
    price: 5500,
    images: ["https://example.com/maxi-box.jpg"],
    categorySlugs: ["korobka", "interer"],
    tags: ["макси", "премиум"],
    inStock: true,
    sortOrder: 18,
  },
  {
    name: 'Дуо "Летнее солнце"',
    price: 2600,
    images: ["https://example.com/summer-sun.jpg"],
    categorySlugs: ["duo-trio", "sezon"],
    tags: ["дуо", "лето"],
    inStock: true,
    sortOrder: 19,
  },
  {
    name: 'Интерьерная "Минимализм"',
    price: 4200,
    images: ["https://example.com/minimalism.jpg"],
    categorySlugs: ["interer", "authorskie"],
    tags: ["интерьер", "минимализм"],
    inStock: true,
    sortOrder: 20,
  },
];

async function seed() {
  try {
    await connectDB();

    // Очистка базы данных
    await Category.deleteMany({});
    await Bouquet.deleteMany({});

    console.log("🗑️  База данных очищена");

    // Создание категорий
    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ Создано ${categories.length} категорий`);

    // Создание словаря slug -> ObjectId
    const categoryMap = new Map();
    categories.forEach((cat) => {
      categoryMap.set(cat.slug, cat._id);
    });

    // Создание букетов
    const bouquetsToInsert = bouquetsData.map((bouquet) => {
      const categoryIds = bouquet.categorySlugs
        .map((slug) => categoryMap.get(slug))
        .filter((id) => id !== undefined);

      return {
        name: bouquet.name,
        slug: slugify(bouquet.name, {
          lower: true,
          strict: true,
          locale: "ru",
        }),
        price: bouquet.price,
        oldPrice: bouquet.oldPrice,
        images: bouquet.images,
        categoryIds,
        tags: bouquet.tags,
        inStock: bouquet.inStock,
        sortOrder: bouquet.sortOrder,
        description: bouquet.description,
      };
    });

    const bouquets = await Bouquet.insertMany(bouquetsToInsert);
    console.log(`✅ Создано ${bouquets.length} букетов`);

    console.log("🎉 Seed завершен успешно!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Ошибка при выполнении seed:", error);
    process.exit(1);
  }
}

seed();
