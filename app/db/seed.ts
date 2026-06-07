import { db } from "@/app/db";
import * as schema from "@/app/db/schema";

export async function seedDatabase() {
  //  perform seeding with usual SQL-like database operations

  try {
    const customer = await db
      .insert(schema.customers)
      .values({
        name: "Yablo Schuman",
        email: "yschuman@codenail.com",
      })
      .returning();

    await db.insert(schema.invoices).values({
      customer_id: customer[0].id,
      date: new Date().toISOString().split("T")[0],
      amount: 1000,
      status: "paid",
    });

    console.log("Database seeded");
  } catch (error) {
    console.error(error);
  }
}

seedDatabase();
