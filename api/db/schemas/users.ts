import { relations } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { tableCreator, withTimestamp } from "./_table";
import { postsTable } from "./posts";

export const roleEnum = ["ADMIN", "USER"] as const;

export const usersTable = tableCreator("users", {
  ...withTimestamp,
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  role: text("role", { enum: roleEnum }).notNull().default("USER"),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable, { relationName: "post__author" }),
}));

export type UserModel = typeof usersTable.$inferSelect;
export type InsertUserModel = typeof usersTable.$inferInsert;
