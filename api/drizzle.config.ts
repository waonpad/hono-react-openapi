import fs from "node:fs";
import type { Config } from "drizzle-kit";

export default (() => {
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

  return {
    schema: "./db/schemas",
    out: "./db/migrations",
    dbCredentials: {
      url: sqliteFileName,
    },
    dialect: "sqlite",
  } satisfies Config;
})();
