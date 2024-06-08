import { relations } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { tableCreator, withTimestamp } from "./_table";
import { usersTable } from "./users";

export const postsTable = tableCreator("posts", {
  ...withTimestamp,
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  body: text("body").notNull(),
  public: integer("public", { mode: "boolean" }),
  authorId: text("authorId")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const postsTableRelations = relations(postsTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [postsTable.authorId],
    references: [usersTable.id],
    relationName: "post__author",
  }),
}));

export type PostModel = typeof postsTable.$inferSelect;
export type InsertPostModel = typeof postsTable.$inferInsert;
