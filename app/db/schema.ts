// Path: app/db/schema.ts

import {
  date,
  timestamp,
  pgEnum,
  pgTable,
  uuid,
  real,
  varchar,
} from "drizzle-orm/pg-core";

export const enumInvoiceStatus = pgEnum("status", ["paid", "pending"]);

export const enumPriority = pgEnum("priority", ["low", "medium", "high"]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  name: varchar("name").notNull(),
  description: varchar("description"),
  user_id: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "restrict",
    })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tickets table
export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  name: varchar("name").notNull(),
  description: varchar("description"),
  priority: enumPriority("priority").notNull(),
  project_id: uuid("project_id")
    .references(() => projects.id, {
      onDelete: "cascade",
      onUpdate: "restrict",
    })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

//
// old, from https://nextjs.org/learn example
//

// Customer table
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  image_url: varchar("image_url")
    .notNull()
    .default("/customers/evil-rabbit.png"),
});

// Invoice table
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  customer_id: uuid("customer_id")
    .notNull()
    .references(() => customers.id, {
      onDelete: "cascade",
      onUpdate: "restrict",
    }),
  amount: real("amount").notNull(),
  status: enumInvoiceStatus("status").notNull(),
  date: date("date").notNull().defaultNow(),
});

// Revenue table
export const revenues = pgTable("revenues", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  month: varchar("month").notNull().unique(),
  revenue: real("revenue").notNull(),
});

// Types
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type Revenue = typeof revenues.$inferSelect;
export type NewRevenue = typeof revenues.$inferInsert;
