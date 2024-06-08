import { sql } from "drizzle-orm";
import { sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// export const mySqlTable = mysqlTableCreator((name) => `t3turbo_${name}`);
const table = sqliteTableCreator((name) => `${name}`);

export { table as tableCreator };

export const withTimestamp = {
  createdAt: text("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: text("updatedAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
};

export const omitTimestamp = {
  createdAt: true,
  updatedAt: true,
} as const;
