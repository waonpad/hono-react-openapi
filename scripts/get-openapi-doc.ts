import { write } from "bun";

const main = async () => {
  const res = await fetch("http://localhost:8787/specification", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // .src/lib/docs.tsにて認証設定をしている
      authorization: "Bearer bearer-token",
    },
  });

  if (!res.ok) {
    console.error(`Failed to get OpenAPI document: ${res.status}`);
    return;
  }

  const json = await res.json();

  // ファイルに保存する
  write("openapi.json", JSON.stringify(json, null, 2));

  console.log("OpenAPI document has been saved to openapi.json");
};

main();
