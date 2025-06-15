import { db } from "@/db/index";
import { type Category, categories } from "@/db/schema";

function createCategory() {
  return {
    name: "test",
    description: "test description",
    slug: "test slug",
  };
}

export async function seedCategories(input: { count: number }) {
  const count = input.count ?? 100;

  try {
    const data: Omit<Category, "id">[] = [];

    for (let i = 0; i < count; i++) {
      data.push(createCategory());
    }

    await db.delete(categories);

    console.log("📝 Inserting data: ", data.length);

    await db.insert(categories).values(data).onConflictDoNothing();
  } catch (err) {
    console.error(err);
  }
}
