/**
 * @description
 * ローカルのsqliteにダミーデータを挿入する
 * $ bun seed:dev
 */

import { Database } from "bun:sqlite";
import { postFixture, userFixture } from "@/__tests__/fixtures";
import { drizzle } from "drizzle-orm/bun-sqlite";

import fs from "node:fs";
import * as schema from "./schemas";
import { type PostModel, postsTable } from "./schemas/posts";
import { type UserModel, usersTable } from "./schemas/users";

/**
 * bun devでサーバーを立ち上げ、DBアクセスをする処理を行うとsqliteファイルが自動生成される
 */
const sqliteFileName = (() => {
  try {
    const dir = "./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/";

    // .sqlite拡張子で検索

    const files = fs.readdirSync(dir);

    const sqliteFiles = files.filter((file) => file.endsWith(".sqlite"));

    if (sqliteFiles.length === 0) {
      throw new Error("SQLite file not found");
    }

    return dir + sqliteFiles[0];
  } catch {
    throw new Error("SQLite file not found");
  }
})();

const sqlite = new Database(sqliteFileName);
const db = drizzle(sqlite, { schema });

console.log("Seeding Started...");

const newUsers: UserModel[] = new Array(100).fill(0).map(() => userFixture.build());
await db.insert(usersTable).values(newUsers);

const newPosts: PostModel[] = new Array(2000)
  .fill(0)
  .map(() =>
    postFixture.build({
      authorId: newUsers[Math.floor(Math.random() * newUsers.length)].id,
    }),
  )
  .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
await db.insert(postsTable).values(newPosts);

console.log("Seeding Completed!");
